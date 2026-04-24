package main

import (
	"context"
	"log/slog"
	"net/http"
	"os"
	"os/signal"

	"tyupin-dev/internal/api"
	"tyupin-dev/internal/config"
)

func main() {
	logger := slog.New(slog.NewTextHandler(os.Stdout, nil))

	cfg, err := config.LoadConfig()
	if err != nil {
		logger.Error("Ошибка загрузки конфигурации", "error", err)
		os.Exit(1)
	}

	server := api.NewHTTPServer(cfg)

	if !cfg.Prod {
		go func() {
			err := http.ListenAndServe(cfg.Server.HTTPAddr, server.Manager.HTTPHandler(nil))
			if err != nil {
				logger.Error("Ошибка запуска сервера для редиректа", "error", err)
				os.Exit(1)
			}
		}()
	}

	gracefulCh := make(chan os.Signal, 1)
	signal.Notify(gracefulCh, os.Interrupt)

	go func() {
		if cfg.Prod {
			logger.Info("Запуск HTTPS сервера", slog.String("addr", cfg.Server.Addr))
			if err := server.ListenAndServeTLS("", ""); err != http.ErrServerClosed && err != nil {
				logger.Error("Ошибка запуска HTTPS сервера", "error", err)
				os.Exit(1)
			}
		} else {
			logger.Info("Запуск HTTP сервера", slog.String("addr", cfg.Server.HTTPAddr))
			if err := server.ListenAndServe(); err != http.ErrServerClosed && err != nil {
				logger.Error("Ошибка запуска HTTP сервера", "error", err)
				os.Exit(1)
			}
		}
	}()

	<-gracefulCh

	logger.Info("Остановка сервера...")

	if err := server.Shutdown(context.Background()); err != nil {
		logger.Error("Ошибка остановки сервера", "error", err)
		os.Exit(1)
	}

	logger.Info("Сервер остановлен")
}

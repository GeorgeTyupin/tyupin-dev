package api

import (
	"net/http"
	"tyupin-dev/internal/config"

	"golang.org/x/crypto/acme/autocert"
)

type Server struct {
	*http.Server

	Manager *autocert.Manager
}

func NewHTTPServer(cfg *config.Config) *Server {
	manager := newAutoCertManager(cfg)

	return &Server{
		Manager: manager,
		Server: &http.Server{
			Addr:         cfg.Server.Addr,
			Handler:      registerRoutes(),
			TLSConfig:    newTLSConfig(manager),
			ReadTimeout:  cfg.Server.ReadTimeout,
			WriteTimeout: cfg.Server.WriteTimeout,
			IdleTimeout:  cfg.Server.IdleTimeout,
		},
	}
}

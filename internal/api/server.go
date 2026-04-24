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

	addr := cfg.Server.DevAddr
	if cfg.Prod {
		addr = cfg.Server.ProdAddr
	}

	return &Server{
		Manager: manager,
		Server: &http.Server{
			Addr:         addr,
			Handler:      registerRoutes(),
			TLSConfig:    newTLSConfig(manager),
			ReadTimeout:  cfg.Server.ReadTimeout,
			WriteTimeout: cfg.Server.WriteTimeout,
			IdleTimeout:  cfg.Server.IdleTimeout,
		},
	}
}

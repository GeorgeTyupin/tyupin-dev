package api

import (
	"crypto/tls"
	"tyupin-dev/internal/config"

	"golang.org/x/crypto/acme/autocert"
)

const certCachePath = "secret-dir"

func newAutoCertManager(cfg *config.Config) *autocert.Manager {
	return &autocert.Manager{
		Cache:      autocert.DirCache(certCachePath),
		Prompt:     autocert.AcceptTOS,
		HostPolicy: autocert.HostWhitelist(cfg.Server.Host1, cfg.Server.Host2),
	}
}

func newTLSConfig(manager *autocert.Manager) *tls.Config {
	cfg := manager.TLSConfig()
	cfg.MinVersion = tls.VersionTLS13

	return cfg
}

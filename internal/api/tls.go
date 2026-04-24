package api

import (
	"crypto/tls"
	"tyupin-dev/internal/config"

	"golang.org/x/crypto/acme/autocert"
)

const certCachePath = "certs-cache"

func newAutoCertManager(cfg *config.Config) *autocert.Manager {
	return &autocert.Manager{
		Cache:      autocert.DirCache(certCachePath),
		Prompt:     autocert.AcceptTOS,
		HostPolicy: autocert.HostWhitelist(cfg.Server.PrimaryHost, cfg.Server.WWWHost),
	}
}

func newTLSConfig(manager *autocert.Manager) *tls.Config {
	cfg := manager.TLSConfig()
	cfg.MinVersion = tls.VersionTLS13

	return cfg
}

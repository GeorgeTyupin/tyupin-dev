package api

import (
	"net/http"

	"tyupin-dev/internal/api/handlers"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func registerRoutes() *chi.Mux {
	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.Compress(5))

	r.Get("/", handlers.HandleIndex)
	r.Get("/api/github/user", handlers.HandleUser)
	r.Get("/api/github/repos", handlers.HandleRepos)
	r.Get("/api/github/contributions", handlers.HandleContributions)

	r.Handle("/static/*", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))
	r.Handle("/templates/*", http.StripPrefix("/templates/", http.FileServer(http.Dir("templates"))))

	return r
}

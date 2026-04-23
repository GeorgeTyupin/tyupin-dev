package handlers

import (
	"net/http"
	"path/filepath"
)

func HandleIndex(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, filepath.Join("templates", "index.html"))
}

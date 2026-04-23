package handlers

import (
	"encoding/json"
	"net/http"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"time"

	"tyupin.dev/internal/client"
	"tyupin.dev/internal/lib/cache"
	"tyupin.dev/internal/lib/utils"
	"tyupin.dev/internal/models"
)

var (
	userCache    cache.Cache
	reposCache   cache.Cache
	contribCache cache.Cache
)

type ContribDay struct {
	Date  string `json:"date"`
	Count int    `json:"count"`
}

var (
	rectRe  = regexp.MustCompile(`<rect\b[^>]*>`)
	dateRe  = regexp.MustCompile(`data-date="(\d{4}-\d{2}-\d{2})"`)
	countRe = regexp.MustCompile(`data-count="(\d+)"`)
)

func HandleContributions(w http.ResponseWriter, r *http.Request) {
	if data, ok := contribCache.Get(); ok {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("X-Cache", "HIT")
		w.Write(data)
		return
	}

	html, err := client.FetchHTML("https://github.com/users/" + client.GithubUser + "/contributions")
	if err != nil {
		http.Error(w, "github unavailable", http.StatusBadGateway)
		return
	}

	var days []ContribDay
	for _, rect := range rectRe.FindAll(html, -1) {
		dm := dateRe.FindSubmatch(rect)
		cm := countRe.FindSubmatch(rect)
		if dm == nil || cm == nil {
			continue
		}
		count, _ := strconv.Atoi(string(cm[1]))
		days = append(days, ContribDay{Date: string(dm[1]), Count: count})
	}

	sort.Slice(days, func(i, j int) bool { return days[i].Date < days[j].Date })

	// Последние 24 недели = 168 дней
	if len(days) > 168 {
		days = days[len(days)-168:]
	}

	out, _ := json.Marshal(days)
	contribCache.Set(out, time.Hour)
	w.Header().Set("Content-Type", "application/json")
	w.Write(out)
}

func HandleUser(w http.ResponseWriter, r *http.Request) {
	if data, ok := userCache.Get(); ok {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("X-Cache", "HIT")
		w.Write(data)
		return
	}
	data, err := client.GitHubGet("https://api.github.com/users/" + client.GithubUser)
	if err != nil {
		http.Error(w, "github unavailable", http.StatusBadGateway)
		return
	}
	userCache.Set(data, 5*time.Minute)
	w.Header().Set("Content-Type", "application/json")
	w.Write(data)
}

func HandleRepos(w http.ResponseWriter, r *http.Request) {
	if data, ok := reposCache.Get(); ok {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("X-Cache", "HIT")
		w.Write(data)
		return
	}
	data, err := client.GitHubGet("https://api.github.com/users/" + client.GithubUser + "/repos?per_page=100&sort=pushed")
	if err != nil {
		http.Error(w, "github unavailable", http.StatusBadGateway)
		return
	}

	var raw []map[string]any
	if err := json.Unmarshal(data, &raw); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.Write(data)
		return
	}

	var slim []models.Repo
	for _, r := range raw {
		lang := utils.StrVal(r["language"])
		if strings.EqualFold(lang, "templ") {
			lang = "Go"
		}
		repo := models.Repo{
			Name:     utils.StrVal(r["name"]),
			FullName: utils.StrVal(r["full_name"]),
			HTMLURL:  utils.StrVal(r["html_url"]),
			Language: lang,
			Fork:     utils.BoolVal(r["fork"]),
			PushedAt: utils.StrVal(r["pushed_at"]),
		}
		if d, ok := r["description"]; ok && d != nil {
			repo.Description = utils.StrVal(d)
		}
		if s, ok := r["stargazers_count"]; ok && s != nil {
			if f, ok := s.(float64); ok {
				repo.Stars = int(f)
			}
		}
		slim = append(slim, repo)
	}
	out, _ := json.Marshal(slim)
	reposCache.Set(out, 5*time.Minute)
	w.Header().Set("Content-Type", "application/json")
	w.Write(out)
}

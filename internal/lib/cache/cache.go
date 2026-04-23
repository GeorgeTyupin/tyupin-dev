package cache

import (
	"sync"
	"time"
)

type Cache struct {
	mu      sync.Mutex
	data    []byte
	expires time.Time
}

func (c *Cache) Get() ([]byte, bool) {
	c.mu.Lock()
	defer c.mu.Unlock()
	if time.Now().Before(c.expires) && c.data != nil {
		return c.data, true
	}
	return nil, false
}

func (c *Cache) Set(data []byte, ttl time.Duration) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.data = data
	c.expires = time.Now().Add(ttl)
}

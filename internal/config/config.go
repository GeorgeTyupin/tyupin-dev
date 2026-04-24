package config

import (
	"time"

	"github.com/ilyakaznacheev/cleanenv"
	"github.com/joho/godotenv"
)

const (
	serverConfigPath = "configs/server.yaml"
	prodEnvPath      = "configs/prod.env"
)

type ServerConfig struct {
	Addr         string        `yaml:"addr"`
	HTTPAddr     string        `yaml:"httpAddr"`
	ReadTimeout  time.Duration `yaml:"readTimeout"`
	WriteTimeout time.Duration `yaml:"writeTimeout"`
	IdleTimeout  time.Duration `yaml:"idleTimeout"`
	PrimaryHost  string        `yaml:"host1"`
	WWWHost      string        `yaml:"host2"`
}

type Config struct {
	Prod   bool         `env:"PROD" envDefault:"false"`
	Server ServerConfig `yaml:"server"`
}

func LoadConfig() (*Config, error) {
	_ = godotenv.Load(prodEnvPath)

	var cfg Config
	if err := cleanenv.ReadEnv(&cfg); err != nil {
		return nil, err
	}

	if err := cleanenv.ReadConfig(serverConfigPath, &cfg); err != nil {
		return nil, err
	}

	return &cfg, nil
}

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
	Host1        string        `yaml:"host1"`
	Host2        string        `yaml:"host2"`
}

type Config struct {
	Prod   bool         `env:"PROD" envDefault:"false"`
	Server ServerConfig `yaml:"server"`
}

func LoadConfig() (*Config, error) {
	err := godotenv.Load(prodEnvPath)
	if err != nil {
		return nil, err
	}

	var cfg Config
	err = cleanenv.ReadEnv(&cfg)
	if err != nil {
		return nil, err
	}

	err = cleanenv.ReadConfig(serverConfigPath, &cfg)
	if err != nil {
		return nil, err
	}

	return &cfg, nil
}

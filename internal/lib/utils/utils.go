package utils

func StrVal(v any) string {
	if v == nil {
		return ""
	}
	if s, ok := v.(string); ok {
		return s
	}
	return ""
}

func BoolVal(v any) bool {
	if b, ok := v.(bool); ok {
		return b
	}
	return false
}

package main

import (
	"fmt"
	"io"
	"net/http"
	"os"
)

// funciona para obtener variables de entorno
func getVariable(key string, def string) string {
	variable := os.Getenv(key)
	if len(variable) != 0 {
		return variable
	} else {
		return def
	}
}

func main() {

	admin_service_route := getVariable("ADMIN_HOST", "http://localhost:8081")
	data_service_route := getVariable("DATA_HOST", "http://localhost:8082")
	port := ":" + getVariable("GATEWAY_PORT", "8080")

	http.HandleFunc("/admin/", proxy(admin_service_route, 6))
	http.HandleFunc("/data/", proxy(data_service_route, 5))

	fmt.Println("Go Gateway is Runing in Port " + port)
	http.ListenAndServe(port, nil)
}

func proxy(target string, patch_long int) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var sub_patch = r.URL.String()[patch_long:]
		targetURL := target + sub_patch
		req, err := http.NewRequest(r.Method, targetURL, r.Body)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadGateway)
			return
		}

		req.Header = r.Header

		client := &http.Client{}
		resp, err := client.Do(req)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadGateway)
			return
		}
		defer resp.Body.Close()

		for key, values := range resp.Header {
			for _, value := range values {
				w.Header().Add(key, value)
			}
		}

		w.WriteHeader(resp.StatusCode)

		// Copy the response body to the client
		_, err = io.Copy(w, resp.Body)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadGateway)
			return
		}
	}
}

import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/fiap-agrosmart/",
  plugins: [
    tailwindcss(),
  ],
  server: {
    watch: {
      ignored: ["**/backend/**"],
    },
    proxy:{
      "/dados": "http://localhost:3000"
      },
    }
});

// Tailwind config
tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: "#1DB954",
        secondary: "#191414",
        accent: "#1ED760",
        background: "#121212",
        foreground: "#FFFFFF",
        muted: "#282828",
        "muted-foreground": "#B3B3B3",
      },
    },
  },
};

// Load songs from JSON
document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("songs-container");

  try {
    const res = await fetch("song.json");
    const songs = await res.json();

    songs.forEach((song) => {
      const div = document.createElement("div");
      div.className =
        "flex items-center justify-between bg-muted p-4 rounded-lg hover:bg-secondary transition";

      div.innerHTML = `
        <div class="flex items-center space-x-4">
          <img src="${song.cover}" class="w-12 h-12 object-cover rounded">
          <div>
            <h3 class="font-medium">${song.title}</h3>
            <p class="text-muted-foreground text-sm">${song.artist}</p>
          </div>
        </div>
        <span class="text-muted-foreground">${song.duration}</span>
      `;

      container.appendChild(div);
    });
  } catch (err) {
    container.innerHTML = `<p class="text-red-500">Không thể tải API JSON!</p>`;
    console.error(err);
  }
});

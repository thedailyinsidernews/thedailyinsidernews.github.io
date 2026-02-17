const API_URL = "https://qykppopnwedvjylcetar.supabase.co/functions/v1/create";

function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

async function generateLink() {
  const target = document.getElementById('targetUrl').value.trim();
  const title = document.getElementById('linkTitle').value.trim();
  const desc = document.getElementById('linkDesc').value.trim();
  const img = document.getElementById('linkImg').value.trim();

  if (!target || !title) {
    alert("Please fill in the required fields.");
    return;
  }

  if (!isValidURL(target)) {
    alert("The original URL is not valid.");
    return;
  }

  const btn = document.getElementById("createBtn");
  btn.innerHTML = "Generating...";
  btn.disabled = true;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: title,
        description: desc,
        image: img,
        target: target
      })
    });

    if (!response.ok) {
      throw new Error("Server error");
    }

    const data = await response.json();

    const shortUrl = data.shortUrl || data.url || target;

    document.getElementById("finalLink").value = shortUrl;
    document.getElementById("resultArea").classList.remove("d-none");

    setupSharing(shortUrl, title);

  } catch (error) {
    console.error(error);
    alert("An error occurred while generating the link.");
  }

  btn.innerHTML = "Generate Short Link";
  btn.disabled = false;
}

function copyLink() {
  const link = document.getElementById("finalLink").value;
  navigator.clipboard.writeText(link).then(() => {
    alert("Link copied successfully ✅");
  });
}

function setupSharing(url, title) {
  document.getElementById("shareWa").href =
    `https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + url)}`;

  document.getElementById("shareFb").href =
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

  document.getElementById("shareX").href =
    `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;

  document.getElementById("shareTg").href =
    `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
}

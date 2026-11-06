export function conversationUrl(message = "Hi Ipinnuoluwa, I found your portfolio. I'd love to talk through an idea or a challenge with you.") {
  return `https://wa.me/2348133754181?text=${encodeURIComponent(message)}`;
}

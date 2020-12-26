import express from "express";
const port = process.env.PORT || 5000;

const app = express();

app.get("*", (request, response, next) => {
  // Redirect http to https, and www to root.
  if (
    (request.headers["x-forwarded-proto"] &&
      request.headers["x-forwarded-proto"] !== "https") ||
    request.hostname === "www.emojese.org"
  ) {
    const url = `https://emojese.org${request.url}`;
    response.redirect(301, url);
  } else {
    next();
  }
});

app.use(express.static("static"));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

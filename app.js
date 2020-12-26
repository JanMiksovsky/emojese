import express from "express";
const port = process.env.PORT || 5000;

const app = express();

app.get("*", (request, response, next) => {
  if (
    request.headers["x-forwarded-proto"] &&
    request.headers["x-forwarded-proto"] !== "https"
  ) {
    // Redirect http to https.
    const url = `https://${request.hostname}${request.url}`;
    response.redirect(301, url);
  } else {
    next();
  }
});

app.use(express.static("static"));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

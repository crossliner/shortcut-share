require("dotenv").config();

const app = require("fastify")();

const mimeTypes = require("mime-types");
const randomstring = require("randomstring");
const { readFile, writeFile, access } = require("fs/promises");
const { join, extname } = require("path");

app.register(require("fastify-multipart"));

class NotFoundError extends Error {
  constructor(message) {
    super();
    this.statusCode = 404;
    this.message = message;

  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super();
    this.statusCode = 401;
    this.message = message;

  }
}

app.post("/upload", async (req, res) => {
  if (req.headers["x-upload-key"] !== process.env.UPLOAD_KEY) throw new UnauthorizedError("Invaild upload key");

  const file = await req.file();
  const data = await file.toBuffer();

  const fileName = randomstring.generate({
    charset: "alphanumeric",
    length: 8
  }) + extname(file.filename);
  const filePath = join(__dirname, "../uploads", fileName);
  await writeFile(filePath, data);

  return {
    fileUrl: "\u200D" + process.env.FILE_URL + fileName
  };
});

app.get("/:file", async (req, res) => {
  const filePath = join(__dirname, "../uploads" , req.params.file);
  try { 
    await access(filePath)
    const mimeType = mimeTypes.lookup(req.params.file);

    res.header("Content-Type", mimeType).send(await readFile(filePath));
  } catch(err) {
    throw new NotFoundError("File not found")
  }
});

app.listen(process.env.PORT);
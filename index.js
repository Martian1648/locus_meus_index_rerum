const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

const cors = require("cors");
app.use(cors());
require('./ir/index_rerum.js');

const authorsRouter = require('./routes/authors');
app.use('/authors', authorsRouter);

const documentsRouter = require('./routes/documents');
app.use('/documents', documentsRouter);

const usersRouter = require('./routes/users');
app.use('/users', usersRouter);

const checkedOutsRouter = require('./routes/checked_outs');
app.use('/checked_outs', checkedOutsRouter);


app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});

app.listen(PORT, () => {
    console.log("API is running");
    console.log(`Test the health check at http://localhost:${PORT}/health`)
})
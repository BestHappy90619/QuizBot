const PineconeClient = require("@pinecone-database/pinecone").PineconeClient;
const PDFLoader = require("langchain/document_loaders/fs/pdf").PDFLoader;
const DocxLoader = require("langchain/document_loaders/fs/docx").DocxLoader;
const TextLoader = require("langchain/document_loaders/fs/text").TextLoader;
const RecursiveCharacterTextSplitter =
  require("langchain/text_splitter").RecursiveCharacterTextSplitter;
const Document = require("langchain/document").Document;
const OpenAIEmbeddings =
  require("langchain/embeddings/openai").OpenAIEmbeddings;
const PineconeStore = require("langchain/vectorstores/pinecone").PineconeStore;
const { loadQAChain } = require("langchain/chains");
const OpenAI = require("langchain/llms/openai").OpenAI;
const {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
} = require("langchain/prompts");
const { ChatOpenAI } = require("langchain/chat_models/openai");

const path = require("path");
const fs = require("fs");

const Bot = require("../models/bot.model");
const {
  PUBLIC_URL,
  PINECONE_API_KEY,
  PINECONE_ENVIRONMENT,
  PINECONE_INDEX_NAME,
} = require("../utils/secrets");

const OPENAI_API_KEY =
  "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

async function getPineconeIndex() {
  const pinecone = new PineconeClient();
  await pinecone.init({
    environment: PINECONE_ENVIRONMENT,
    apiKey: PINECONE_API_KEY,
  });
  return pinecone.Index(PINECONE_INDEX_NAME);
}

async function generateQA(text, level, isMCQ, num) {
  let jsonFormat = "";
  if (isMCQ == 1)
    switch (level) {
      case 0:
        jsonFormat = `{{"question":"Multiple choice questions used to test someone's knowledge or comprehension.",
            "options":"List of possible four choices of the multiple choice question.",
            "answer":"Correct answer for question."}}`;
        break;
      case 1:
        jsonFormat = `{{"question":"Multiple choice questions used to test someone's ability to separate an idea into its parts and demonstrate an understanding of the relationship of the parts to the whole, or identify the relevant information and rules to arrive at a solution and solve problems using known algorithms. You must output question as one of these types: 'Differentiate', 'Compare/Contrast', 'Distinguish x from y?', 'How does x affect or relate to y?', 'How could x be used to y?', 'How would you show, make use of, modify, demonstrate, solve, apply x to conditions y?'.",
            "options":"List of possible four choices of the multiple choice question.",
            "answer":"Correct answer for question."}}`;
        break;
      case 2:
        jsonFormat = `{{"question":"Multiple choice questions used to test someone's ability to rephrase information using their own statements, or translate knowledge into new concepts, or remember facts they have already learned. You must output question as one of these types: 'Give an example', 'Interpret', 'Infer', 'Summarize', 'Explain', 'Define', 'List', 'Identify'.",
            "options":"List of possible four choices of the multiple choice question.",
            "answer":"Correct answer for question."}}`;
        break;
    }
  else
    switch (level) {
      case 0:
        jsonFormat = `{{"question":"Question used to test someone's knowledge or comprehension.",
            "answer":"Correct answer for question."}}`;
        break;
      case 1:
        jsonFormat = `{{"question": "Question used to test someone's ability to separate an idea into its parts and demonstrate an understanding of the relationship of the parts to the whole, or identify the relevant information and rules to arrive at a solution and solve problems using known algorithms. You must output question as one of these types: 'Differentiate', 'Compare/Contrast', 'Distinguish x from y?', 'How does x affect or relate to y?', 'How could x be used to y?', 'How would you show, make use of, modify, demonstrate, solve, apply x to conditions y?'",
            "answer":"Correct answer for question."}}`;
        break;
      case 2:
        jsonFormat = `{{"question": "Question used to test someone's ability to rephrase information using their own statements, or translate knowledge into new concepts, or remember facts they have already learned. You must output question as one of these types: 'Give an example', 'Interpret', 'Infer', 'Summarize', 'Explain', 'Define', 'List', 'Identify'",
            "answer":"Correct answer for question."}}`;
        break;
    }
  let newPrompt = `Generate ${
    num == 1 ? "only one question" : num + " " + "questions"
  } from the most key problem of the content along with the correct answer. You must format your output as the following JSON value.
    [${jsonFormat}]
    This is the content.
    {text}`;
  const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    HumanMessagePromptTemplate.fromTemplate(newPrompt),
  ]);
  const input = await chatPrompt.formatPromptValue({
    text: text,
  });

  const model = new ChatOpenAI({
    temperature: 0,
    modelName: "gpt-4",
    openAIApiKey: OPENAI_API_KEY,
  });
  const response = await model.call(input.toChatMessages());

  let resTxt = response.text.trim();

  // resTxt = JSON.parse(
  //   resTxt.slice(resTxt.indexOf("{"), resTxt.lastIndexOf("}") + 1)
  // );

  resTxt = JSON.parse(resTxt);

  return resTxt;
}

function fileLoad(fileName, srcUrl) {
  //Determine file's extension
  const extensionName = path.extname(fileName);

  let loader;
  if (extensionName === ".pdf") {
    loader = new PDFLoader(path.join(__dirname, PUBLIC_URL + srcUrl), {
      splitPages: false,
      pdfjs: () => import("pdf-parse/lib/pdf.js/v1.9.426/build/pdf.js"),
    });
  } else if (extensionName === ".docx") {
    loader = new DocxLoader(path.join(__dirname, PUBLIC_URL + srcUrl));
  } else {
    loader = new TextLoader(path.join(__dirname, PUBLIC_URL + srcUrl));
  }

  return loader;
}

exports.create = (req, res, next) => {
  const file = req.file;
  const { bot_name, description, namespace, created_by } = req.body;
  if (
    !file ||
    !bot_name ||
    !description ||
    !namespace ||
    created_by === undefined
  )
    return res.status(400).send({ msg: "Wrong Request!" });
  Bot.create(
    {
      bot_name,
      description,
      img_url: `/${namespace}/${file.filename}`,
      namespace,
      created_by,
    },
    (err, data) => {
      if (err) {
        res.status(500).send({
          status: "error",
          message: err.message,
        });
      } else {
        res.status(200).send({
          status: "success",
          data: {},
        });
      }
    }
  );
};

exports.getBotById = (req, res, next) => {
  const bot_id = req.body.bot_id;
  if (bot_id === undefined)
    return res.status(400).json({ message: "Parameter Error" });
  Bot.getBotById(bot_id, (err, data) => {
    if (err) {
      res.status(500).send({
        status: "error",
        message: err.message,
      });
    } else {
      if (data != null) {
        res.status(200).send({
          status: "success",
          data,
        });
      } else {
        res.status(404).send({
          status: "not found",
          data: {
            message: "Nothing!",
          },
        });
      }
    }
  });
};

exports.delBotById = async (req, res, next) => {
  const bot_id = req.body.bot_id;
  const namespace = req.body.namespace;
  if (bot_id === undefined || namespace === undefined)
    return res.status(400).json({ message: "Parameter Error" });
  try {
    const pineconeIndex = await getPineconeIndex();
    await pineconeIndex.delete1({
      deleteAll: true,
      namespace: namespace + "",
    });
  } catch (error) {
    return res.status(501).json(error);
  }

  Bot.delBotById(bot_id, (err, data) => {
    if (err) {
      res.status(500).send({
        status: "error",
        message: err.message,
      });
    } else {
      fs.rm(
        path.join(__dirname, PUBLIC_URL + namespace),
        { recursive: true },
        (error) => {
          if (error) {
            res.status(503).send({
              status: "error",
              message: error,
            });
          }
          res.status(200).send({
            status: "success",
            data: {
              message: data.message,
            },
          });
        }
      );
    }
  });
};

exports.changeBot = async (req, res, next) => {
  const file = req.file;
  const { bot_name, description, namespace, id, noUploadedAvatar } = req.body;
  if (
    (!file && !noUploadedAvatar) ||
    !bot_name ||
    !description ||
    namespace === undefined ||
    id === undefined
  )
    return res.status(400).send({ msg: "Wrong Request!" });
  Bot.changeBot(
    {
      bot_name,
      description,
      id,
    },
    (err, data) => {
      if (err) {
        res.status(500).send({
          status: "error",
          message: err.message,
        });
      } else {
        res.status(200).send({
          status: "success",
          data: {},
        });
      }
    }
  );
};

exports.isActive = (req, res, next) => {
  const bot_id = req.body.bot_id;
  if (bot_id === undefined)
    return res.status(400).json({ message: "Parameter Error" });
  Bot.isActive(bot_id, (err, data) => {
    if (err) {
      res.status(500).send({
        status: "error",
        message: err.message,
      });
    } else {
      res.status(200).send({
        status: "success",
        data: data !== 0,
      });
    }
  });
};

exports.getReply = async (req, res, next) => {
  const namespace = req.body.namespace;
  const message = req.body.message;
  if (namespace === undefined || !message)
    return res.status(400).json({ message: "Parameter Error" });
  try {
    const pineconeIndex = await getPineconeIndex();
    /* create vectorstore*/
    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({ openAIApiKey: OPENAI_API_KEY }),
      {
        pineconeIndex: pineconeIndex,
        textKey: "text",
        namespace: namespace + "",
      }
    );

    const llm = new OpenAI({
      openAIApiKey: OPENAI_API_KEY,
      temperature: 0,
    });
    const results = await vectorStore.similaritySearch(message, 5);

    const chain = loadQAChain(llm, { type: "stuff" });

    const result = chain
      .call({
        input_documents: results,
        question: message,
      })
      .then(async (row) => {
        return res.status(200).json(row);
      });
  } catch (error) {
    res.status(501).send(error);
  }
};

exports.search = async (req, res, next) => {
  const { search } = req.body;
  if (search === undefined)
    return res.status(400).json({ message: "Parameter Error" });
  Bot.search(search, (err, data) => {
    if (err) {
      res.status(500).send({
        status: "error",
        message: err.message,
      });
    } else {
      res.status(200).send({
        status: "success",
        data,
      });
    }
  });
};

exports.getAllTrainDataByBot = (req, res, next) => {
  const bot_id = req.body.bot_id;
  if (bot_id === undefined)
    return res.status(400).json({ message: "Parameter Error" });
  Bot.getAllTrainDataByBot(bot_id, (err, data) => {
    if (err) {
      res.status(500).send({
        status: "error",
        message: err.message,
      });
    } else {
      if (data == null) {
        res.status(404).send({
          status: "not found",
          data: [],
        });
      } else {
        res.status(200).send({
          status: "success",
          data,
        });
      }
    }
  });
};

exports.uploadTrainData = (req, res, next) => {
  try {
    const file = req.file;
    const { namespace, bot_id, user_id } = req.body;

    if (
      !file ||
      namespace === undefined ||
      bot_id === undefined ||
      user_id === undefined
    )
      return res.status(400).send({ msg: "Wrong Request!" });

    const filename = file.filename;
    const originalname = file.originalname;
    const doc_url = `/${namespace}/traindatas/${file.filename}`;

    Bot.createTrainData(
      { filename, originalname, doc_url, bot_id, user_id },
      async (err, data) => {
        if (err) {
          res.status(500).send({
            status: "error",
            message: err.message,
          });
        } else {
          if (data != null) {
            try {
              const pineconeIndex = await getPineconeIndex();

              const loader = fileLoad(file.filename, doc_url);

              const rawDocs = await loader.load();

              const textSplitter = new RecursiveCharacterTextSplitter({
                chunkSize: 500,
                chunkOverlap: 0,
              });

              const docs = await textSplitter.splitDocuments([
                new Document({
                  pageContent: rawDocs[0].pageContent,
                }),
              ]);

              const embeddings = new OpenAIEmbeddings({
                openAIApiKey: OPENAI_API_KEY,
              });
              await PineconeStore.fromDocuments(docs, embeddings, {
                pineconeIndex: pineconeIndex,
                namespace: namespace + "",
              });
            } catch (err) {
              return res
                .status(501)
                .json({ key: data.id, label: file.originalname });
            }

            Bot.changeIsTrainedById(
              { id: data.id, is_trained: 1 },
              (err, data1) => {
                if (err) {
                  res.status(500).send({
                    status: "error",
                    message: err.message,
                  });
                } else {
                  res
                    .status(200)
                    .json({ key: data.id, label: file.originalname });
                }
              }
            );
          }
        }
      }
    );
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getTrainDataById = (req, res, next) => {
  const trainDataId = req.body.trainDataId;
  if (!trainDataId) return res.status(400).json({ message: "Parameter Error" });
  Bot.getTrainDataById(trainDataId, (err, data) => {
    if (err) {
      res.status(500).send({
        status: "error",
        message: err.message,
      });
    } else {
      if (data != null) {
        res.status(200).send({
          status: "success",
          data,
        });
      } else {
        res.status(404).send({
          status: "not found",
          data: {
            message: "Nothing!",
          },
        });
      }
    }
  });
};

exports.delTrainDataById = async (req, res, next) => {
  const {
    delTrainDataId,
    delTrainDataFilename,
    delTrainDataIsTrained,
    namespace,
    bot_id,
  } = req.body;

  if (
    !delTrainDataId ||
    !delTrainDataFilename ||
    delTrainDataIsTrained === null ||
    delTrainDataIsTrained === undefined ||
    namespace === undefined ||
    !bot_id
  )
    return res.status(400).json({ message: "Parameter Error" });

  let pineconeIndex;
  try {
    if (delTrainDataIsTrained) {
      pineconeIndex = await getPineconeIndex();
      await pineconeIndex.delete1({
        deleteAll: true,
        namespace: namespace + "",
      });
    }
  } catch (err) {
    return res.status(501).json(err);
  }
  Bot.delTrainDataById(
    { tid: delTrainDataId, bid: bot_id, is_trained: delTrainDataIsTrained },
    async (err, data) => {
      if (err) {
        res.status(500).send({
          status: "error",
          message: err.message,
        });
        return;
      }
      if (data == null) {
        res.status(404).send({
          status: "not found",
          data: {
            message: "Nothing!",
          },
        });
      } else {
        fs.unlink(
          path.join(
            __dirname,
            PUBLIC_URL + `/${namespace}/traindatas/${delTrainDataFilename}`
          ),
          async (err) => {
            if (err) {
              res.status(503).send({
                status: "error",
                message: err.message,
              });
            } else {
              if (delTrainDataIsTrained) {
                for (let i = 0; i < data.length; i++) {
                  const filename = data[i].filename;
                  const reTrainDataUrl = `/${namespace}/traindatas/${filename}`;
                  console.log("retrain this doc ->  ", reTrainDataUrl);

                  try {
                    const loader = fileLoad(filename, reTrainDataUrl);

                    const rawDocs = await loader.load();

                    const textSplitter = new RecursiveCharacterTextSplitter({
                      chunkSize: 500,
                      chunkOverlap: 0,
                    });

                    const docs = await textSplitter.splitDocuments([
                      new Document({
                        pageContent: rawDocs[0].pageContent,
                      }),
                    ]);

                    const embeddings = new OpenAIEmbeddings({
                      openAIApiKey: OPENAI_API_KEY,
                    });

                    await PineconeStore.fromDocuments(docs, embeddings, {
                      pineconeIndex: pineconeIndex,
                      namespace: namespace + "",
                    });
                    Bot.changeIsTrainedById(
                      { id: data[i].id, is_trained: 1 },
                      (err, data) => {
                        if (err) {
                          res.status(500).send({
                            status: "error",
                            message: err.message,
                          });
                        } else {
                          return;
                        }
                      }
                    );
                  } catch (err) {
                    console.log("reTraining is failed!");
                    continue;
                  }
                }
              }

              res.status(200).send({
                status: "success",
                data: {
                  message: "Delete a training data successfully!",
                },
              });
            }
          }
        );

        return;
      }
    }
  );
};

exports.clearTrainDataByBotId = async (req, res, next) => {
  const bot_id = req.body.bot_id;
  const namespace = req.body.namespace;
  if (bot_id === undefined || namespace === undefined)
    return res.status(400).json({ message: "Parameter Error" });

  try {
    const pineconeIndex = await getPineconeIndex();
    await pineconeIndex.delete1({
      deleteAll: true,
      namespace: namespace + "",
    });
  } catch (error) {
    return res.status(501).json(error);
  }
  Bot.clearTrainDataByBotId(bot_id, async (err, data) => {
    if (err) {
      res.status(500).send({
        status: "error",
        message: err.message,
      });
      return;
    }
    if (data) {
      fs.rm(
        path.join(__dirname, PUBLIC_URL + namespace + "/traindatas"),
        { recursive: true },
        (error) => {
          if (error)
            res.status(503).send({
              status: "error",
              message: error.message,
            });
          res.status(200).send({
            status: "success",
            data: [],
          });
        }
      );
      return;
    }
  });
};

exports.retraindData = async (req, res, next) => {
  try {
    const id = req.body.id;
    const filename = req.body.filename;
    const namespace = req.body.namespace;
    if (!filename || namespace === undefined || id === undefined)
      return res.status(400).send({ msg: "Wrong Request!" });
    const doc_url = `/${namespace}/traindatas/${filename}`;
    try {
      const pineconeIndex = await getPineconeIndex();

      const loader = fileLoad(filename, doc_url);

      const rawDocs = await loader.load();

      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 0,
      });

      const docs = await textSplitter.splitDocuments([
        new Document({
          pageContent: rawDocs[0].pageContent,
        }),
      ]);

      const embeddings = new OpenAIEmbeddings({
        openAIApiKey: OPENAI_API_KEY,
      });

      await PineconeStore.fromDocuments(docs, embeddings, {
        pineconeIndex: pineconeIndex,
        namespace: namespace + "",
      });
    } catch (err) {
      return res.status(501).json(err);
    }

    Bot.changeIsTrainedById({ id: id, is_trained: 1 }, (err, data) => {
      if (err) {
        res.status(500).send({
          status: "error",
          message: err.message,
        });
      } else {
        res.status(200).json({ msg: "success retrain!" });
      }
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getAllQA = async (req, res) => {
  const { level, isMCQ, traindata_id, selectedPage, selectedPagesize, search } =
    req.body;
  if (
    level === undefined ||
    isMCQ === undefined ||
    traindata_id === undefined ||
    selectedPage === undefined ||
    selectedPagesize === undefined ||
    search === undefined
  )
    return res.status(400).send({ msg: "Wrong Request!" });
  Bot.getAllQA(
    { level, isMCQ, traindata_id, selectedPage, selectedPagesize, search },
    (err, data) => {
      if (err) {
        res.status(500).send({
          status: "error",
          message: err.message,
        });
      } else {
        if (data != null) {
          return res.status(200).send({
            status: "success",
            data,
          });
        } else {
          res.status(404).send({
            status: "not found",
            data: {
              qas: [],
              total: 0,
            },
          });
        }
      }
    }
  );
};

exports.delQAById = async (req, res) => {
  const { id, isMCQ } = req.body;
  if (id === undefined || isMCQ === undefined)
    return res.status(400).json({ message: "Parameter Error" });
  Bot.delQAById({ id, isMCQ }, (err, data) => {
    if (err) {
      res.status(500).send({
        status: "error",
        message: err.message,
      });
    } else {
      res.status(200).send({
        status: "success",
        data: {
          message: data.message,
        },
      });
    }
  });
};

exports.getQAById = async (req, res) => {
  const { id, isMCQ } = req.body;
  if (id === undefined || isMCQ === undefined)
    return res.status(400).json({ message: "Parameter Error" });
  Bot.getQAById({ id, isMCQ }, (err, data) => {
    if (err) {
      res.status(500).send({
        status: "error",
        message: err.message,
      });
    } else {
      if (data != null) {
        res.status(200).send({
          status: "success",
          data,
        });
      } else {
        res.status(404).send({
          status: "not found",
          data: {
            message: "Nothing!",
          },
        });
      }
    }
  });
};

exports.updateQAById = (req, res, next) => {
  const { id, isMCQ, updatedInfo } = req.body;
  if (id === undefined || isMCQ === undefined || updatedInfo === undefined)
    return res.status(400).json({ message: "Parameter Error" });
  Bot.updateQAById({ id, isMCQ, updatedInfo }, (err, data) => {
    if (err) {
      res.status(500).send({
        status: "error",
        message: err.message,
      });
    } else {
      res.status(200).send({
        status: "success",
        data: {
          message: "success",
        },
      });
    }
  });
};

exports.resetQAbyTrainData = async (req, res) => {
  const { traindata_id } = req.body;
  if (!traindata_id)
    return res.status(400).json({ message: "Parameter Error" });
  Bot.resetQAbyTrainData({ traindata_id }, (err, data) => {
    if (err) {
      res.status(500).send({
        status: "error",
        message: err.message,
      });
    } else {
      res.status(200).send({
        status: "success",
        data: {
          message: data.message,
        },
      });
    }
  });
};

exports.addQAbyTrainData = async (req, res) => {
  const { level, isMCQ, traindata_id, num } = req.body;
  if (
    level === undefined ||
    isMCQ === undefined ||
    traindata_id === undefined ||
    num === undefined
  )
    return res.status(400).json({ message: "Parameter Error" });
  Bot.determineAction({ level, isMCQ, traindata_id }, (err, data) => {
    if (err) {
      res.status(500).send({
        status: "error",
        message: err.message,
      });
    } else {
      if (data[0].length > 0 || (data[0].length == 0 && data[1][0].cnt == 0)) {
        //generate QA
        Bot.getTrainDataById(traindata_id, async (err1, data1) => {
          if (err1) {
            res.status(500).send({
              status: "error",
              message: err1.message,
            });
          } else {
            if (data1 != null) {
              Bot.getChunk(
                { traindata_id, level, isMCQ },
                async (err2, data2) => {
                  if (err2) {
                    res.status(500).send({
                      status: "error",
                      message: err2.message,
                    });
                  } else {
                    try {
                      let chunkNums = "";
                      let chunkNum = 0;
                      const loader = fileLoad(
                        data1[0].filename,
                        data1[0].doc_url
                      );
                      const rawDocs = await loader.load();
                      rawDocs[0].pageContent = rawDocs[0].pageContent
                        .replace(/\s\s+/g, " ")
                        .replace(/\\/g, "\\\\")
                        .replace(/\n/g, " ");
                      const textSplitter = new RecursiveCharacterTextSplitter({
                        chunkSize: 8000,
                        chunkOverlap: 100,
                      });
                      const docs = await textSplitter.splitDocuments([
                        new Document({
                          pageContent: rawDocs[0].pageContent,
                        }),
                      ]);
                      if (data2 != null) {
                        chunkNums = data2["chunk_nums"];
                        let chunkArr = chunkNums.split(",");
                        if (chunkArr.length == 1) {
                          chunkNum = chunkArr[0];
                          chunkNums = "";
                        } else {
                          let chunkNumOrder = Math.floor(
                            Math.random() * (chunkArr.length - 0) + 0
                          );
                          chunkNum = chunkArr[chunkNumOrder];
                          chunkNums = chunkNums.replace(
                            chunkNumOrder == 0
                              ? chunkNum + ","
                              : "," + chunkNum,
                            ""
                          );
                        }
                      } else {
                        chunkNums = "0";
                        for (let i = 1; i < docs.length; i++)
                          chunkNums += "," + i;
                        chunkNum = Math.floor(
                          Math.random() * (docs.length - 0) + 0
                        );
                        chunkNums =
                          chunkNum == 0
                            ? chunkNums.replace("0,", "")
                            : chunkNums.replace("," + chunkNum, "");
                      }
                      let qa = await generateQA(
                        docs[chunkNum].pageContent,
                        level,
                        isMCQ,
                        num
                      );
                      await Bot.createQA({ qa, traindata_id, level, isMCQ });
                      data2 == null
                        ? await Bot.createChunkRec({
                            newRecStr: chunkNums,
                            traindata_id,
                            level,
                            isMCQ,
                          })
                        : chunkNums.length == 0
                        ? await Bot.delChunkRec({ traindata_id, level, isMCQ })
                        : await Bot.updateChunkRec({
                            updateRecStr: chunkNums,
                            traindata_id,
                            level,
                            isMCQ,
                          });
                      res.status(200).send({
                        status: "success",
                        data: qa,
                      });
                    } catch (error) {
                      res.status(501).send(error);
                    }
                  }
                }
              );
            } else {
              res.status(404).send({
                status: "not found",
                data: {
                  message: "Nothing!",
                },
              });
            }
          }
        });
      } else if (data[0].length == 0 && data[1][0].cnt > 0) {
        //no QA anymore
        res.status(204).send({
          status: "no QA anymore",
          data: {},
        });
      }
    }
  });
};

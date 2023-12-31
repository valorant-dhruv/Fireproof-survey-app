import { useFireproof } from "use-fireproof";
import { Link } from "react-router-dom";
import { useState } from "react";
import { AutoFocusInput } from "./AutoFocusInput";
import { SurveyDoc } from "../pages/Survey";
import { InlineEditor } from "./InlineEditor";

export type ItemDoc = {
  _id?: string;
  surveyId: string;
  survey?: SurveyDoc;
  question: string;
  options: object;
  description?: string;
  created: number;
  updated: number;
  type: "item";
};
const arr: number[] = [1, 2, 3, 4];
//Inside this each item should be a poll
//For that the question and the options will be given by the user and stored inside the database
export function Items({ surveyId }: { surveyId: string }) {
  const { database, useLiveQuery } = useFireproof("surveys");
  const [isCreating, setIsCreating] = useState(false);
  const [questionName, setQuestionName] = useState("");
  const [isEditing, setisEditing] = useState(false);
  const [options, setoptions] = useState({
    1: "",
    2: "",
    3: "",
    4: "",
  });
  const [temp, settemp] = useState("");

  const items = useLiveQuery(
    (doc, emit) => {
      if (doc.type === "item") {
        emit(doc.surveyId);
      }
    },
    { descending: false, key: surveyId }
  ).docs as ItemDoc[];

  const handleCreateClick = async () => {
    console.log("This is the question", questionName);
    console.log("These are the options:", options);
    const topicDoc: ItemDoc = {
      type: "item",
      surveyId,
      question: questionName,
      options,
      created: Date.now(),
      updated: Date.now(),
    };
    await database.put(topicDoc);
    setIsCreating(false);
    setQuestionName("");
    setoptions({
      1: "",
      2: "",
      3: "",
      4: "",
    });
  };
  return (
    <div className="py-2">
      <h2 className="text-xl text-bold">Polls</h2>
      <ul className="list-inside list-none">
        <li key="add" className="p-2">
          {isCreating ? (
            <form
              className="flex flex-col items-center"
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateClick();
              }}
              style={{
                padding: "20px",
                background: "#f7f7f7",
                border: "1px solid #ccc",
                borderRadius: "15px",
                maxWidth: "320px",
                // margin: "0 auto",
              }}
            >
              <AutoFocusInput
                value={questionName}
                isActive={isCreating}
                onChange={(e) => setQuestionName(e.target.value)}
                className="bg-slate-300 p-2 text-sm text-black mb-2"
                placeholder="Enter the question"
              />
              {Object.keys(options).map((key, index) => {
                let placeholder = `Option ${index + 1}`;
                return (
                  <div>
                    <AutoFocusInput
                      key={key}
                      value={options[key]}
                      isActive={isCreating}
                      onChange={(e) => {
                        setoptions((oldOptions) => {
                          return {
                            ...oldOptions,
                            [key]: e.target.value,
                          };
                        });
                      }}
                      className="bg-slate-300 p-2 text-sm text-black mb-2"
                      placeholder={placeholder}
                    />
                    <br />
                  </div>
                );
              })}

              {/* <button
                type="submit"
                className="ml-2"
                style={{
                  background: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  padding: "5px 10px",
                  cursor: "pointer",
                }}
              >
                ✔️
              </button>
              <button
                className="ml-2"
                style={{
                  background: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  padding: "5px 10px",
                  cursor: "pointer",
                }}
              >
                Close
              </button> */}
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="submit"
                  style={{
                    background: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    padding: "5px 10px",
                    cursor: "pointer",
                    fontSize: "1rem",
                  }}
                >
                  ✔️ Create
                </button>
                <button
                  onClick={(e) => {
                    setIsCreating(false);
                  }}
                  style={{
                    background: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    padding: "5px 10px",
                    cursor: "pointer",
                    fontSize: "1rem",
                  }}
                >
                  ✖ Close
                </button>
              </div>
            </form>
          ) : (
            <>
              <span className="inline-block text-slate-700">+</span>
              <span
                onClick={() => setIsCreating(true)}
                className="inline-block ml-2"
              >
                Create a new poll
              </span>
            </>
          )}
        </li>

        {items.map((doc) => (
          <li
            key={doc._id}
            className="p-2 text-gray-500 flex flex-col justify-between items-start"
            style={{ alignItems: "flex-start" }} // Align children to the start (vertically)
          >
            {isEditing && (
              <InlineEditor
                field="question"
                topic={doc}
                database={database}
                isEditing={isEditing}
                setIsEditing={setisEditing}
              ></InlineEditor>
            )}
            {!isEditing && (
              <div>
                {/* <poll-party host="poll-party.genmon.partykit.dev"> */}
                <poll-party host="https://smart-book-party.valorant-dhruv.partykit.dev">
                  <question style={{ color: "black" }}>{doc.question}</question>
                  <option id={doc.options["1"]} style={{ color: "black" }}>
                    {doc.options["1"]}
                  </option>
                  <option id={doc.options["2"]} style={{ color: "black" }}>
                    {doc.options["2"]}
                  </option>
                  <option id={doc.options["3"]} style={{ color: "black" }}>
                    {doc.options["3"]}
                  </option>
                  <option id={doc.options["4"]} style={{ color: "black" }}>
                    {doc.options["4"]}
                  </option>
                </poll-party>
              </div>
            )}
            {/* <Link
              to={`/poll/${doc._id}`}
              className="block hover:bg-gray-100 dark:hover:bg-gray-800 rounded px-2 flex-grow"
            >
              <span className="font-bold">Change title?</span>
            </Link> */}
            <span className="text-xs pb-2">
              {new Date(doc.updated).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
      <button
        onClick={(e) => {
          setisEditing((oldata) => {
            return !oldata;
          });
        }}
      >
        <span className="font-bold">Change titles?</span>
      </button>
    </div>
  );
}

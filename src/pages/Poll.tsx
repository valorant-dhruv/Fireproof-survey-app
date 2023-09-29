// pages/Item.tsx

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useFireproof } from "use-fireproof";
import { ItemDoc } from "../components/Items";
import { SurveyDoc } from "./Survey";
import { InlineEditor } from "../components/InlineEditor";

export function Poll() {
  const { id } = useParams<{ id: string }>();
  console.log("This is the id", id);
  const { database } = useFireproof("surveys");
  const [item, setItem] = useState<ItemDoc | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      const doc = (await database.get(id!)) as ItemDoc;
      // console.log(doc, "This is the document");
      doc.survey = (await database.get(doc.surveyId as string)) as SurveyDoc;
      // console.log("This is the document topic", doc.survey);
      if (doc.type === "item") {
        setItem(doc);
      }
    };
    fetchItem();
  }, [id, database]);

  if (!item) {
    return <div>Loading...</div>;
  }

  const surveyId = item.surveyId;

  return (
    <div className="bg-blue-500 text-black p-6 rounded-lg shadow-lg">
      <Link to={`/survey/${surveyId}`} className="text-white">
        ← back to {item.survey?.title}
      </Link>
      <InlineEditor
        field="question"
        topic={item}
        database={database}
        isEditing={isEditingName}
        setIsEditing={setIsEditingName}
      ></InlineEditor>
      <hr></hr>
      <br></br>
      <p className="text-sm">
        Created: {new Date(item.created).toLocaleString()}
      </p>
      <p className="text-sm">
        Updated: {new Date(item.updated).toLocaleString()}
      </p>
    </div>
  );
}

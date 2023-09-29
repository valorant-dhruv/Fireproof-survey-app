import { useState } from 'react'
import {
  useParams
  // , useNavigate
} from 'react-router-dom'
import { useFireproof } from 'use-fireproof'
import { Items } from '../components/Items'
import { InlineEditor } from '../components/InlineEditor'


export type SurveyDoc = {
  _id?: string
  title: string
  description?: string
  created: number
  updated: number
  type: 'survey'
}

export function Survey() {
  // const navigate = useNavigate() // Initialize useHistory hook
  const [isEditing, setIsEditing] = useState(false)
  const [isEditingTitle, setIsEditingTitle] = useState(false)

  const { database, useLiveQuery } = useFireproof('surveys')
  const { id } = useParams()

  const surveys = useLiveQuery('_id', { key: id })
  const [survey] = surveys.docs as SurveyDoc[]

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        {isEditingTitle ? (
          <InlineEditor
            field="title"
            topic={survey}
            database={database}
            isEditing={isEditingTitle}
            setIsEditing={setIsEditingTitle}
          />
        ) : (
          <h1 className="text-2xl font-bold" onClick={() => setIsEditingTitle(true)}>
            {survey?.title}
          </h1>
        )}
      </div>
      <div className="mb-2">
        <span className="text-sm text-gray-500">
          Created: {new Date(survey?.created).toLocaleString()}
        </span>
        <span className="ml-4 text-sm text-gray-500">
          Updated: {new Date(survey?.updated).toLocaleString()}
        </span>
      </div>
      <Items surveyId={id!} />
    </div>
  )
}

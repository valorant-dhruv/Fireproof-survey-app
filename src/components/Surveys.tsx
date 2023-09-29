import { useFireproof } from 'use-fireproof'
import { Link } from 'react-router-dom'
import { SurveyDoc } from '../pages/Survey'
import { useState } from 'react'
import { AutoFocusInput } from './AutoFocusInput'

export function Surveys() {
  const { database, useLiveQuery } = useFireproof('surveys')
  const [isCreating, setIsCreating] = useState(false)
  const [surveyName, setSurveyName] = useState('')

  const surveys = useLiveQuery(
    (doc, emit) => {
      if (doc.type === 'survey') {
        emit(doc.title)
      }
    },
    { descending: false }
  ).docs as SurveyDoc[]

  const handleCreateClick = async () => {
    const surveyDoc: SurveyDoc = {
      type: 'survey',
      title: surveyName,
      created: Date.now(),
      updated: Date.now()
    }
    await database.put(surveyDoc)
    setIsCreating(false)
    setSurveyName('')
  }
  return (
    <div className="py-2">
      <h2 className="text-2xl text-bold">Surveys</h2>
      <ul className="list-inside list-none">
        <li key="add" className="p-2">
          {isCreating ? (
            <form
              className="flex items-center"
              onSubmit={e => {
                e.preventDefault()
                handleCreateClick()
              }}
            >
              <AutoFocusInput
                value={surveyName}
                isActive={isCreating}
                onChange={e => setSurveyName(e.target.value)}
                className="bg-slate-300 p-1 mr-2 text-xs text-black flex-grow"
              />
              <button type="submit" className="ml-2">
                ✔️
              </button>
            </form>
          ) : (
            <>
              <span className="inline-block text-slate-700">+</span>
              <span onClick={() => setIsCreating(true)} className="inline-block ml-2">
                Create new survey
              </span>
            </>
          )}
        </li>
        {surveys.map(doc => (
          <li key={doc._id} className="p-2 text-gray-500">
            <Link
              to={`/survey/${doc._id}`}
              className="block text-xs hover:bg-gray-100 dark:hover:bg-gray-800 rounded p-2"
            >
              <span className="block font-bold">{doc.title}</span>
              <span className="block">{new Date(doc.updated).toLocaleString()}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

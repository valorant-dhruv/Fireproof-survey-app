export function Home() {
  return (
    <div className="prose prose-slate dark:prose-invert">
      <h1>Fireproof Partykit Survey App</h1>
      <p>
        This application makes use of fireproof storage as the default database.
        It uses partykit to implement the voting mechanism thanks to this{" "}
        <a href="https://github.com/partykit/sketch-polls">Sketch-Polls</a>
      </p>
      <p>
        Try creating a survey on the left and create a poll inside the survey.
      </p>

      <p>
        Also once you are logged in with your respective email click on it to go
        to the dashboard. You will be able to import all the data you have worked
        with in this website and take a snapshot of it. Pretty Awesome right?
      </p>
      <p>Have Fun!</p>
    </div>
  );
}

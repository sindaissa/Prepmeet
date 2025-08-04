from flask import Flask, request, render_template
from assistant_agent import assistant_response
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def index():  
    if request.method == "POST":
        client_name = request.form["client"]
        meeting_type = request.form["meeting_type"]  
        project_topic = request.form["project_topic"]
        question = request.form["question"]
        response = assistant_response(client_name, meeting_type, project_topic, question)  
        return render_template("index.html", response=response, question=question)
    return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True)






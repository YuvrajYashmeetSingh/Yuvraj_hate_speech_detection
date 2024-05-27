from flask import Flask, request, jsonify
from flask_cors import CORS # CORS for handling Cross-Origin Resource Sharing
import pickle 
import re
import string
import nltk
from nltk.corpus import stopwords
from nltk.stem import SnowballStemmer

# Create a Flask application instance
app = Flask(__name__)

# Enable CORS for all routes, allowing requests from any origin
CORS(app,resources={r"/*":{"origins":"*"}})

model = pickle.load(open('yuvraj_hate_speech(1).pkl', 'rb')) #loading ml model using pickle

cv = pickle.load(open('count_vectorizer.pkl', 'rb')) #loading count vectorizer using pickle for extracting features

nltk.download('stopwords')
stopwords_set = set(stopwords.words('english'))
stemmer = SnowballStemmer("english")

# Preprocess function
def clean(text):
    text = text.lower()
    text = re.sub(r'https?://\S+|www\.\S+', '', text)  # Remove URLs
    text = re.sub(r'<.*?>', '', text)  # Remove HTML tags
    text = text.translate(str.maketrans('', '', string.punctuation))  # Remove punctuation
    text = re.sub(r'\d+', '', text)  # Remove digits
    text = text.replace('\n', ' ')  # Remove newlines
    text = ' '.join(word for word in text.split() if word not in stopwords_set)  # Remove stopwords
    text = ' '.join(stemmer.stem(word) for word in text.split())  # Stemming
    return text

@app.route('/', methods=['GET'])
def get_data():
    data = {
        "message":"API is Running 100"
    }
    return jsonify(data)
  
# Define a route for making predictions
@app.route('/predict', methods=['POST'])
def predict():
    try:
        
        data = request.json['data'] #getting data from frontend
        print(data)
        preprocessed_text=clean(data) #prepocessing the datae means removing digits, newlines ,stopwords etc.
        print(preprocessed_text)
   
        text_vectorized=cv.transform([preprocessed_text]).toarray() #extracting freatures and converting into 2d array
        
        prediction=model.predict(text_vectorized )  #putting values to predict
        print(prediction)
        return jsonify({'Prediction': prediction[0]}) #seding data into fronend 
    except Exception as e:
        return jsonify({'error': str(e)}) #if there is error



if __name__ == '__main__':
    app.run(debug=True, port=5000)  #port no

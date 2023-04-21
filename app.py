from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import numpy as np
import pandas as pd
import difflib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import csv

# set up TMDb API credentials
TMDB_API_KEY = "b2a2c76c34c1a8b3cef1d6be69e0881f"

app = Flask(__name__)
CORS(app)

@app.route('/home', methods=['POST'])
def movie():
    movies_data = pd.read_csv('E:\Movie-Recommendation-System\webapp\src\\assets\movies.csv')
    # selecting the relevant features for recommendation
    selected_features = ['genres','keywords','tagline','cast','director', 'runtime', 'vote_average']
    # replacing the null values with null string
    for feature in selected_features:
        movies_data[feature] = movies_data[feature].fillna('')
    # combining all the selected features
    combined_features = movies_data['genres']+' '+movies_data['keywords']+' '+movies_data['tagline']+' '+movies_data['cast']+' '+movies_data['director']
    # converting the text data to feature vectors
    vectorizer = TfidfVectorizer()
    feature_vectors = vectorizer.fit_transform(combined_features)
    similarity = cosine_similarity(feature_vectors)
    # getting the movie name from the user
    request_data = request.get_json()
    movie_name = request_data['movie_name']
    # creating a list with all the movie names given in the dataset
    list_of_all_titles = movies_data['title'].tolist()
    # finding the close match for the movie name given by the user
    find_close_match = difflib.get_close_matches(movie_name, list_of_all_titles)
    close_match = find_close_match[0]
    # finding the index of the movie with title
    index_of_the_movie = movies_data[movies_data.title == close_match]['index'].values[0]
    # getting a list of similar movies
    similarity_score = list(enumerate(similarity[index_of_the_movie]))
    len(similarity_score)
    # sorting the movies based on their similarity score
    sorted_similar_movies = sorted(similarity_score, key = lambda x:x[1], reverse = True)
    # create a list of suggested movie titles and their details
    suggested_movies = []
    for movie in sorted_similar_movies:
        index = movie[0]
        title_from_index = movies_data.loc[index, 'title']
        if len(suggested_movies) < 8:
            suggested_movies.append({'title': title_from_index, 'genres': movies_data.loc[index, 'genres'], 'runtime': movies_data.loc[index, 'runtime'], 'vote_average': movies_data.loc[index, 'vote_average'], 'director': movies_data.loc[index, 'director'], 'poster_url': ''})

    # get the poster URLs for the suggested movies using TMDb API
    for movie in suggested_movies:
        movie_title = movie['title']
        # make an API request to get the movie details
        url = f"https://api.themoviedb.org/3/search/movie?api_key={TMDB_API_KEY}&query={movie_title}"
        response = requests.get(url)
        data = response.json()
        # get the first search result
        if data['total_results'] > 0:
            movie_id = data['results'][0]['id']
            # make another API request to get the poster URL
            url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={TMDB_API_KEY}&append_to_response=images"
            response = requests.get(url)
            data = response.json()
            if 'images' in data:
                poster_path = data['images']['posters'][0]['file_path']
                poster_url = f"https://image.tmdb.org/t/p/w500{poster_path}"
                movie['poster_url'] = poster_url


    return jsonify(suggested_movies)

if __name__ == '__main__':
    app.run(debug=True)


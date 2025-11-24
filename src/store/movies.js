import { defineStore } from "pinia";

export const useMovieStore = defineStore("movies", {
    state: () => ({
        movies: [
            { id: 1, title: "Avengers", poster: "/avengers.png", rating: 4.5, duration: "2h 45m", genres: "Action, Adventure, Superhero", description: "Earth's mightiest heroes must come together and learn to fight as a team to stop the mischievous Loki and his alien army from enslaving humanity." },
            { id: 2, title: "Inception", poster: "/inception.png", rating: 4.8, duration: "2h 20m", genres: "Sci-Fi, Thriller, Mystery", description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO, but his tragic past may doom the project and his team to disaster." },
            { id: 3, title: "Interstellar", poster: "/interstellar.png", rating: 4.7, duration: "2h 49m", genres: "Sci-Fi, Drama, Adventure", description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival as Earth faces environmental collapse." },
            { id: 4, title: "The Dark Knight", poster: "/dark-knight.png", rating: 4.9, duration: "2h 32m", genres: "Action, Crime, Superhero", description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice." },
            { id: 5, title: "Titanic", poster: "/titanic.png", rating: 4.6, duration: "3h 14m", genres: "Romance, Drama, Historical", description: "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic on its maiden voyage." },
            { id: 6, title: "The Matrix", poster: "/matrix.png", rating: 4.7, duration: "2h 16m", genres: "Sci-Fi, Action, Cyberpunk", description: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers." },
            { id: 7, title: "The Godfather", poster: "/godfather.png", rating: 4.9, duration: "2h 55m", genres: "Crime, Drama, Thriller", description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son, who must navigate the dangerous world of power and family loyalty." },
            { id: 8, title: "Jurassic Park", poster: "/jurassic-park.png", rating: 4.5, duration: "2h 7m", genres: "Adventure, Sci-Fi, Thriller", description: "A pragmatic paleontologist touring an almost complete theme park on an island in Central America is tasked with protecting a couple of kids after a power failure causes the park's cloned dinosaurs to run loose." },
            { id: 9, title: "Pulp Fiction", poster: "/pulp-fiction.png", rating: 4.8, duration: "2h 34m", genres: "Crime, Drama, Thriller", description: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption in this groundbreaking crime thriller." },
            { id: 10, title: "Forrest Gump", poster: "/forrest-gump.png", rating: 4.7, duration: "2h 22m", genres: "Drama, Romance, Comedy", description: "The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man with an IQ of 75, whose only desire is to be reunited with his childhood sweetheart." },
            { id: 11, title: "Gladiator", poster: "/gladiator.png", rating: 4.6, duration: "2h 35m", genres: "Action, Drama, Historical", description: "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery as a gladiator." },
            { id: 12, title: "Fight Club", poster: "/fight-club.png", rating: 4.8, duration: "2h 19m", genres: "Drama, Thriller, Psychological", description: "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more in this mind-bending psychological thriller." },
            { id: 13, title: "The Shawshank Redemption", poster: "/shawshank.png", rating: 4.9, duration: "2h 22m", genres: "Drama, Crime, Hope", description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency in this powerful tale of hope and friendship." },
            { id: 14, title: "Avatar", poster: "/avatar.png", rating: 4.6, duration: "2h 42m", genres: "Sci-Fi, Adventure, Fantasy", description: "A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home." },
            { id: 15, title: "Joker", poster: "/joker.png", rating: 4.7, duration: "2h 2m", genres: "Drama, Thriller, Psychological", description: "In Gotham City, mentally troubled comedian Arthur Fleck is disregarded and mistreated by society. He then embarks on a downward spiral of revolution and bloody crime in this dark character study." },
            { id: 16, title: "Spider-Man", poster: "/spiderman.png", rating: 4.5, duration: "2h 1m", genres: "Action, Adventure, Superhero", description: "After being bitten by a genetically-modified spider, a shy teenager gains spider-like abilities that he uses to fight injustice as a masked superhero and face a vengeful enemy." },
            { id: 17, title: "Frozen", poster: "/frozen.png", rating: 4.4, duration: "1h 42m", genres: "Animation, Family, Musical", description: "When the newly crowned Queen Elsa accidentally uses her power to turn things into ice, her sister Anna teams up with a mountain man, his playful reindeer, and a snowman to change the weather condition." },
            { id: 18, title: "The Lion King", poster: "/lion-king.png", rating: 4.8, duration: "1h 58m", genres: "Animation, Family, Adventure", description: "Lion prince Simba and his father are targeted by his bitter uncle, who wants to ascend the throne himself. This timeless tale explores themes of family, responsibility, and the circle of life." },
            { id: 19, title: "Harry Potter", poster: "/harry-potter.png", rating: 4.7, duration: "2h 32m", genres: "Fantasy, Adventure, Magic", description: "An orphaned boy enrolls in a school of wizardry, where he learns the truth about himself, his family and the terrible evil that haunts the magical world." },
            { id: 20, title: "Star Wars", poster: "/star-wars.png", rating: 4.8, duration: "2h 1m", genres: "Sci-Fi, Adventure, Space Opera", description: "Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy from the Empire's world-destroying battle station, while also attempting to rescue Princess Leia." },
            { id: 21, title: "Toy Story", poster: "https://placehold.co/400x600/FF6B6B/FFF?text=Toy+Story", rating: 4.6, duration: "1h 21m", genres: "Animation, Family, Comedy", description: "A cowboy doll is profoundly threatened and jealous when a new spaceman action figure supplants him as top toy in a boy's bedroom, leading to an adventure that teaches the meaning of friendship." },
            { id: 22, title: "Finding Nemo", poster: "https://placehold.co/400x600/4ECDC4/FFF?text=Finding+Nemo", rating: 4.7, duration: "1h 40m", genres: "Animation, Family, Adventure", description: "After his son is captured in the Great Barrier Reef and taken to Sydney, a timid clownfish sets out on a journey to bring him home, encountering unforgettable characters along the way." },
            { id: 23, title: "Black Panther", poster: "https://placehold.co/400x600/9B59B6/FFF?text=Black+Panther", rating: 4.6, duration: "2h 14m", genres: "Action, Adventure, Superhero", description: "T'Challa, heir to the hidden but advanced kingdom of Wakanda, must step forward to lead his people into a new future and confront a challenger from his country's past." }
        ],
        selectedMovie: null,
    }),

    getters: {
        filteredMovies(state) {
            if (!state.searchText) return state.movies;

            return state.movies.filter(movie =>
                movie.title.toLowerCase().includes(state.searchText.toLowerCase())
            );
        }
    },

    actions: {
        setSearchText(text) {
            this.searchText = text;
        },
        getMovie(id) {
            this.selectedMovie = this.movies.find(m => m.id == id);
        }
    }
});

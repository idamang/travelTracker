CREATE TABLE
    ratings (
        user_id INT NOT NULL,
        country_id INT NOT NULL,
        rating_value INT CHECK (rating_value BETWEEN 1 AND 5) NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, country_id),
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (country_id) REFERENCES countries (id)
    );

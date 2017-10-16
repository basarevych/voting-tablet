--
-- Voting tablet users
--

CREATE TABLE voting_tablet_users (
    id int(11) NOT NULL AUTO_INCREMENT,
    portal_id int(11) NOT NULL,
    card_id varchar(255) NOT NULL,
    card_id_date timestamp NOT NULL,
    registration_date timestamp NOT NULL,
    CONSTRAINT voting_tablet_users_pk PRIMARY KEY (id),
    CONSTRAINT voting_tablet_users_unique_portal_id UNIQUE (portal_id)
);

--
-- Voting tablet votes
--

CREATE TABLE voting_tablet_votes (
    id int(11) NOT NULL AUTO_INCREMENT,
    portal_id int(11) NOT NULL,
    vote_date timestamp NOT NULL,
    vote int(11) NOT NULL,
    CONSTRAINT voting_tablet_votes_pk PRIMARY KEY (id)
);

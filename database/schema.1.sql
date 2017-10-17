--
-- Sessions
--

CREATE TABLE voting_tablet_sessions (
    id int(11) NOT NULL AUTO_INCREMENT,
    token varchar(255) NOT NULL,
    portal_id int(11) NOT NULL,
    payload text NOT NULL,
    info text NOT NULL,
    created_at timestamp NOT NULL,
    updated_at timestamp NOT NULL,
    CONSTRAINT voting_tablet_sessions_pk PRIMARY KEY (id),
    CONSTRAINT voting_tablet_sessions_token UNIQUE(token)
);

--
-- Users
--

CREATE TABLE voting_tablet_users (
    id int(11) NOT NULL AUTO_INCREMENT,
    portal_id int(11) NOT NULL,
    card_id text NOT NULL,
    scanned_at timestamp NOT NULL,
    registered_at timestamp NOT NULL,
    CONSTRAINT voting_tablet_users_pk PRIMARY KEY (id)
);

--
-- Votes
--

CREATE TABLE voting_tablet_votes (
    id int(11) NOT NULL AUTO_INCREMENT,
    portal_id int(11) NOT NULL,
    vote int(11) NOT NULL,
    voted_at timestamp NOT NULL,
    CONSTRAINT voting_tablet_votes_pk PRIMARY KEY (id)
);

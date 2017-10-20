--
-- Sessions
--

CREATE TABLE voting_tablet_sessions (
    id int(11) NOT NULL AUTO_INCREMENT,
    token varchar(255) NOT NULL,
    user_id int(11) NULL,
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
    card_id text NULL,
    scanned_at timestamp NULL,
    registered_at timestamp NOT NULL,
    CONSTRAINT voting_tablet_users_pk PRIMARY KEY (id)
);

--
-- Targets
--

CREATE TABLE voting_tablet_targets (
    id int(11) NOT NULL AUTO_INCREMENT,
    code varchar(255) NOT NULL,
    name varchar(255) NOT NULL,
    CONSTRAINT voting_tablet_targets_pk PRIMARY KEY (id)
);

--
-- Votes
--

CREATE TABLE voting_tablet_votes (
    id int(11) NOT NULL AUTO_INCREMENT,
    user_id int(11) NULL,
    portal_id int(11) NOT NULL,
    target_id int(11) NOT NULL,
    score int(11) NOT NULL,
    voted_at timestamp NOT NULL,
    CONSTRAINT voting_tablet_votes_pk PRIMARY KEY (id),
    CONSTRAINT voting_tablet_votes_user_fk FOREIGN KEY(user_id)
        REFERENCES voting_tablet_users(id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT voting_tablet_votes_target_fk FOREIGN KEY(target_id)
        REFERENCES voting_tablet_targets(id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

--
-- Data
--

INSERT INTO voting_tablet_targets (code, name)
     VALUES ('hr', 'HR'),
            ('pr', 'PR'),
            ('it', 'IT'),
            ('fin', 'Financial'),
            ('recept', 'Reception'),
            ('office', 'Office manager');

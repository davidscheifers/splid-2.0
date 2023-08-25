CREATE SCHEMA IF NOT EXISTS splid;

CREATE TABLE IF NOT EXISTS splid."User"
(
    username character varying(255) COLLATE pg_catalog."default" NOT NULL,
    password character varying(255) COLLATE pg_catalog."default" NOT NULL,
    mail character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "number" character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT "User_pkey" PRIMARY KEY (username)
);

CREATE TABLE IF NOT EXISTS splid."Group"
(
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    picture_path character varying(255) COLLATE pg_catalog."default",
    description character varying(255) COLLATE pg_catalog."default",
    created_by character varying COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id uuid NOT NULL,
    CONSTRAINT "Group_pkey" PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS splid."Group_User"
(
    username character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "group_id" uuid NOT NULL,
    CONSTRAINT "Group_User_pkey" PRIMARY KEY (username, "group_id"),
    CONSTRAINT "group" FOREIGN KEY ("group_id")
        REFERENCES splid."Group" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT "user" FOREIGN KEY (username)
        REFERENCES splid."User" (username) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS splid."Transaction"
(
    id uuid NOT NULL,
    description character varying(255) COLLATE pg_catalog."default",
    sender_username character varying(255) COLLATE pg_catalog."default" NOT NULL,
    amount double precision NOT NULL,
    group_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
	receiver_username character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "Transaction_pkey" PRIMARY KEY (id),
    CONSTRAINT "group" FOREIGN KEY (group_id)
        REFERENCES splid."Group" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT "sender" FOREIGN KEY (sender_username)
        REFERENCES splid."User" (username) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
	CONSTRAINT "receiver" FOREIGN KEY (receiver_username)
        REFERENCES splid."User" (username) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS splid."Accounting"
(
    username character varying(255) COLLATE pg_catalog."default" NOT NULL,
    balance double precision NOT NULL DEFAULT 0.0,
    "group_id" uuid NOT NULL,
    CONSTRAINT "Accounting_pkey" PRIMARY KEY (username, "group_id"),
    CONSTRAINT "group" FOREIGN KEY ("group_id")
        REFERENCES splid."Group" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT "user" FOREIGN KEY (username)
        REFERENCES splid."User" (username) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE OR REPLACE FUNCTION update_accounting_balance() 
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NOT EXISTS (SELECT 1 FROM splid."Accounting" WHERE username = NEW.receiver_username) THEN
            INSERT INTO splid."Accounting"(username, group_id, balance) VALUES (NEW.receiver_username, NEW.group_id, NEW.amount);
        ELSE
            UPDATE splid."Accounting" SET balance = balance + NEW.amount WHERE username = NEW.receiver_username AND group_id = NEW.group_id;
        END IF;
    ELSIF TG_OP = 'UPDATE' THEN
        UPDATE splid."Accounting" SET balance = balance + NEW.amount - OLD.amount WHERE username = NEW.receiver_username AND group_id = NEW.group_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE splid."Accounting" SET balance = balance - OLD.amount WHERE username = OLD.receiver_username AND group_id = NEW.group_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_accounting_balance
AFTER INSERT OR UPDATE OR DELETE ON splid."Transaction"
FOR EACH ROW 
EXECUTE FUNCTION update_accounting_balance();

CREATE OR REPLACE FUNCTION insert_accounting_func() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO splid."Accounting" (username, balance, group_id)
    VALUES (NEW.username, 0, NEW.group_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER insert_accounting
AFTER INSERT ON splid."Group_User"
FOR EACH ROW
EXECUTE FUNCTION insert_accounting_func();

CREATE OR REPLACE FUNCTION update_group_updateAt()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE splid."Group"
    SET "update_at" = NOW()
    FROM splid."Transaction"
    WHERE splid."Group".id = NEW."group_id";
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_group_updateAt
AFTER INSERT OR UPDATE OR DELETE ON splid."Transaction"
FOR EACH ROW
EXECUTE FUNCTION update_group_updateAt();

INSERT INTO splid."User"(
	username, password, mail, "number")
	VALUES ( 'admin', '$2b$10$u7rRiUYTt5x.zFrP5.SrwOGP7eX.FLhhM4JD6Z0VnaShR4o0qIj2e','admin@mail.com', '01456');

INSERT INTO splid."User"(
	username, password, mail, "number")
	VALUES ('tester', '$2b$10$u7rRiUYTt5x.zFrP5.SrwOGP7eX.FLhhM4JD6Z0VnaShR4o0qIj2e', 'tester@mail.com', '0815');

INSERT INTO splid."User"(
	username, password, mail, "number")
	VALUES ('max', '$2b$10$u7rRiUYTt5x.zFrP5.SrwOGP7eX.FLhhM4JD6Z0VnaShR4o0qIj2e', 'maxmustermann@mail.com', '007');

INSERT INTO splid."Group"(
	name, picture_path, description, created_by, created_at, update_at, id)
	VALUES ( 'Admin Group', '/GroupPictures/admin.jpeg', 'Admin only Group', 'admin', '2011-01-01 00:00:00+09', '2020-02-01 00:00:00+06', '4aa85f64-5717-4562-b3fc-2c963f66afa6');
	
INSERT INTO splid."Group"(
	name, picture_path, description, created_by, created_at, update_at, id)
	VALUES ( 'Bella Italia', '/GroupPictures/bella_italia.jpeg', 'Italien Urlaub Gruppe', 'max', '2022-01-12 00:00:00', '2022-02-01 00:00:00+06', '5aa66f64-5717-4562-b3fc-2c963f66afa6');

INSERT INTO splid."Group"(
	name, picture_path, description, created_by, created_at, update_at, id)
	VALUES ( 'WG', '/GroupPictures/wg.jpeg', 'WG Gruppe für den wöchentlichen Einkauf', 'admin', '2022-10-12 03:00:00', '2022-11-01 00:00:00+06', 'b6bcd79a-9982-11ed-a8fc-0242ac120002');

INSERT INTO splid."Group"(
	name, picture_path, description, created_by, created_at, update_at, id)
	VALUES ( 'Max', '/GroupPictures/max.jpg', 'Schulden Tracker für Max', 'admin', '2022-10-12 03:00:00', '2022-11-01 00:00:00+06', 'c6bcdace-9982-11ed-a8fc-0242ac120002');

INSERT INTO splid."Group"(
	name, picture_path, description, created_by, created_at, update_at, id)
	VALUES ( 'Sevin', '/GroupPictures/sevin.jpg', 'Schulden Tracker für Sevin', 'admin', '2022-10-12 03:00:00', '2022-11-01 00:00:00+06', 'd6bcdace-9982-11ed-a8fc-0242ac120002');

INSERT INTO splid."Group"(
	name, picture_path, description, created_by, created_at, update_at, id)
	VALUES ( 'Simon', '/GroupPictures/simon.jpg', 'Schulden Tracker für Simon', 'admin', '2022-10-12 03:00:00', '2022-11-01 00:00:00+06', 'd6ccdc40-9982-11ed-a8fc-0242ac120002');

INSERT INTO splid."Group"(
	name, picture_path, description, created_by, created_at, update_at, id)
	VALUES ( 'Amerika', '/GroupPictures/amerika.jpg', 'Amerika Urlaub', 'admin', '2022-12-12 03:45:00', '2022-11-01 00:00:00+06', 'd6bce19a-9982-11ed-a8fc-0242ac120002');

INSERT INTO splid."Group"(
	name, picture_path, description, created_by, created_at, update_at, id)
	VALUES ( 'Schweden', '/GroupPictures/schweden.jpg', 'Schweden Urlaub', 'admin', '2023-01-25 03:45:00', '2022-01-26 00:00:00+06', 'b6bce42e-9982-11ed-a8fc-0242ac120002');

INSERT INTO splid."Group"(
	name, picture_path, description, created_by, created_at, update_at, id)
	VALUES ( 'Softwareprojekt', '/GroupPictures/softwareprojekt.jpg', 'Ausgaben für unser Softwareprojekt', 'admin', '2022-12-12 03:45:00', '2022-11-01 00:00:00+06', 'b6bce2ee-9982-11ed-a8fc-0242ac120002');

INSERT INTO splid."Group"(
	name, picture_path, description, created_by, created_at, update_at, id)
	VALUES ( 'Prag', '/GroupPictures/prag.jpg', 'Kurztrip nach Prag', 'admin', '2022-05-25 03:45:00', '2022-11-01 00:00:00+06', 'e6bce564-9982-11ed-a8fc-0242ac120002');

INSERT INTO splid."Group"(
	name, picture_path, description, created_by, created_at, update_at, id)
	VALUES ( 'Berlin Trip', '/GroupPictures/berlin_trip.jpg', 'Kurztrip nach Berlin', 'admin', '2022-05-25 03:45:00', '2022-11-01 00:00:00+06', 'f6bce6b8-9982-11ed-a8fc-0242ac120002');

INSERT INTO splid."Group"(
	name, picture_path, description, created_by, created_at, update_at, id)
	VALUES ( 'Hamburg Schulung', '/GroupPictures/hamburg_schulung.jpg', 'Schulung in Hamburg', 'admin', '2022-08-09 03:45:00', '2022-11-01 00:00:00+06', 'f6bcea64-9982-11ed-a8fc-0242ac120002');

INSERT INTO splid."Group_User"(
	username, "group_id")
	VALUES ('admin', '4aa85f64-5717-4562-b3fc-2c963f66afa6');
	
INSERT INTO splid."Group_User"(
	username, "group_id")
	VALUES ('admin', '5aa66f64-5717-4562-b3fc-2c963f66afa6');

INSERT INTO splid."Group_User"(
	username, "group_id")
	VALUES ('admin', 'b6bcd79a-9982-11ed-a8fc-0242ac120002');
	
INSERT INTO splid."Group_User"(
	username, "group_id")
	VALUES ('admin', 'c6bcdace-9982-11ed-a8fc-0242ac120002');

INSERT INTO splid."Group_User"(
	username, "group_id")
	VALUES ('admin', 'd6bcdace-9982-11ed-a8fc-0242ac120002');

INSERT INTO splid."Group_User"(
	username, "group_id")
	VALUES ('admin', 'd6ccdc40-9982-11ed-a8fc-0242ac120002');

INSERT INTO splid."Group_User"(
	username, "group_id")
	VALUES ('admin', 'd6bce19a-9982-11ed-a8fc-0242ac120002');

INSERT INTO splid."Group_User"(
	username, "group_id")
	VALUES ('admin', 'b6bce42e-9982-11ed-a8fc-0242ac120002');

INSERT INTO splid."Group_User"(
	username, "group_id")
	VALUES ('admin', 'b6bce2ee-9982-11ed-a8fc-0242ac120002');

INSERT INTO splid."Group_User"(
	username, "group_id")
	VALUES ('admin', 'e6bce564-9982-11ed-a8fc-0242ac120002');

INSERT INTO splid."Group_User"(
	username, "group_id")
	VALUES ('admin', 'f6bce6b8-9982-11ed-a8fc-0242ac120002');

INSERT INTO splid."Group_User"(
	username, "group_id")
	VALUES ('admin', 'f6bcea64-9982-11ed-a8fc-0242ac120002');

INSERT INTO splid."Group_User"(
	username, "group_id")
	VALUES ('max', '5aa66f64-5717-4562-b3fc-2c963f66afa6');

INSERT INTO splid."Group_User"(
	username, "group_id")
	VALUES ('tester', '5aa66f64-5717-4562-b3fc-2c963f66afa6');

INSERT INTO splid."Transaction"(
	id, description, sender_username, amount, group_id, created_at,  receiver_username)
	VALUES ('705da552-998e-11ed-a8fc-0242ac120002','Pizza Mario', 'admin', 112.43, '5aa66f64-5717-4562-b3fc-2c963f66afa6', '2022-02-01 00:00:01+06', 'admin');
	
INSERT INTO splid."Transaction"(
	id, description, sender_username, amount, "group_id", created_at, receiver_username)
	VALUES ('705da7fa-998e-11ed-a8fc-0242ac120002','Pizza Mario', 'admin', -36.65, '5aa66f64-5717-4562-b3fc-2c963f66afa6', '2022-02-01 00:00:02+06','tester');
	
INSERT INTO splid."Transaction"(
	id, description, sender_username, amount, "group_id", created_at, receiver_username)
	VALUES ('705da8fe-998e-11ed-a8fc-0242ac120002','Pizza Mario', 'admin', -50.12, '5aa66f64-5717-4562-b3fc-2c963f66afa6', '2022-02-01 00:00:01+06','admin');

INSERT INTO splid."Transaction"(
	id, description, sender_username, amount, "group_id", created_at, receiver_username)
	VALUES ('705da9da-998e-11ed-a8fc-0242ac120002','Pizza Mario', 'admin', -25.66, '5aa66f64-5717-4562-b3fc-2c963f66afa6', '2022-02-01 00:00:01+06','max');

INSERT INTO splid."Transaction"(
	id, description, sender_username, amount, group_id, created_at, receiver_username)
	VALUES ('705daab6-998e-11ed-a8fc-0242ac120002','Einkauf Lebensmittel', 'max', 143.95,'5aa66f64-5717-4562-b3fc-2c963f66afa6', '2022-02-02 00:00:01+06', 'max');
	
INSERT INTO splid."Transaction"(
	id, description, sender_username, amount, "group_id", created_at, receiver_username)
	VALUES ('705dadcc-998e-11ed-a8fc-0242ac120002','Einkauf Lebensmittel', 'max', -71.975, '5aa66f64-5717-4562-b3fc-2c963f66afa6', '2022-02-02 00:00:02+06', 'admin');
	
INSERT INTO splid."Transaction"(
	id, description, sender_username, amount, "group_id", created_at, receiver_username)
	VALUES ('705daea8-998e-11ed-a8fc-0242ac120002','Einkauf Lebensmittel', 'max', -71.975, '5aa66f64-5717-4562-b3fc-2c963f66afa6', '2022-02-02 00:00:01+06','max');

INSERT INTO splid."Transaction"(
	id, description, sender_username, amount, "group_id", created_at, receiver_username)
	VALUES ('705db150-998e-11ed-a8fc-0242ac120002','Payment', 'tester', 36.65, '5aa66f64-5717-4562-b3fc-2c963f66afa6', '2022-02-02 00:00:01+06','tester');

INSERT INTO splid."Transaction"(
	id, description, sender_username, amount, "group_id", created_at, receiver_username)
	VALUES ('705db27c-998e-11ed-a8fc-0242ac120002','Payment', 'tester', -36.65, '5aa66f64-5717-4562-b3fc-2c963f66afa6', '2022-02-02 00:00:01+06','admin');
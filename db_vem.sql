--
-- PostgreSQL database dump
--

-- Dumped from database version 14.17 (Ubuntu 14.17-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.17 (Ubuntu 14.17-0ubuntu0.22.04.1)

-- Started on 2025-04-05 04:49:40 IST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4 (class 2615 OID 163867)
-- Name: drizzle; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA drizzle;


--
-- TOC entry 831 (class 1247 OID 173372)
-- Name: role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.role AS ENUM (
    'attendee',
    'organizer'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 211 (class 1259 OID 163869)
-- Name: __drizzle_migrations; Type: TABLE; Schema: drizzle; Owner: -
--

CREATE TABLE drizzle.__drizzle_migrations (
    id integer NOT NULL,
    hash text NOT NULL,
    created_at bigint
);


--
-- TOC entry 210 (class 1259 OID 163868)
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE; Schema: drizzle; Owner: -
--

CREATE SEQUENCE drizzle.__drizzle_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3355 (class 0 OID 0)
-- Dependencies: 210
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: drizzle; Owner: -
--

ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNED BY drizzle.__drizzle_migrations.id;


--
-- TOC entry 212 (class 1259 OID 173752)
-- Name: attendees_event_map; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.attendees_event_map (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    event_id uuid NOT NULL,
    attendee_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- TOC entry 213 (class 1259 OID 173759)
-- Name: events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.events (
    event_id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    date date NOT NULL,
    "time" time without time zone NOT NULL,
    organizer_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- TOC entry 214 (class 1259 OID 173768)
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    user_id uuid NOT NULL,
    role public.role NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- TOC entry 215 (class 1259 OID 173772)
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    user_id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    email character varying(255) NOT NULL,
    password text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 3189 (class 2604 OID 163872)
-- Name: __drizzle_migrations id; Type: DEFAULT; Schema: drizzle; Owner: -
--

ALTER TABLE ONLY drizzle.__drizzle_migrations ALTER COLUMN id SET DEFAULT nextval('drizzle.__drizzle_migrations_id_seq'::regclass);


--
-- TOC entry 3198 (class 2606 OID 163876)
-- Name: __drizzle_migrations __drizzle_migrations_pkey; Type: CONSTRAINT; Schema: drizzle; Owner: -
--

ALTER TABLE ONLY drizzle.__drizzle_migrations
    ADD CONSTRAINT __drizzle_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 3200 (class 2606 OID 173758)
-- Name: attendees_event_map attendees_event_map_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendees_event_map
    ADD CONSTRAINT attendees_event_map_id_unique PRIMARY KEY (id);


--
-- TOC entry 3202 (class 2606 OID 173767)
-- Name: events events_event_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_event_id_unique PRIMARY KEY (event_id);


--
-- TOC entry 3204 (class 2606 OID 173782)
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- TOC entry 3206 (class 2606 OID 173780)
-- Name: users users_user_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_user_id_unique PRIMARY KEY (user_id);


--
-- TOC entry 3208 (class 2606 OID 173788)
-- Name: attendees_event_map attendees_event_map_attendee_id_users_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendees_event_map
    ADD CONSTRAINT attendees_event_map_attendee_id_users_user_id_fk FOREIGN KEY (attendee_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3207 (class 2606 OID 173783)
-- Name: attendees_event_map attendees_event_map_event_id_events_event_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendees_event_map
    ADD CONSTRAINT attendees_event_map_event_id_events_event_id_fk FOREIGN KEY (event_id) REFERENCES public.events(event_id) ON DELETE CASCADE;


--
-- TOC entry 3209 (class 2606 OID 173793)
-- Name: events events_organizer_id_users_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_organizer_id_users_user_id_fk FOREIGN KEY (organizer_id) REFERENCES public.users(user_id);


--
-- TOC entry 3210 (class 2606 OID 173798)
-- Name: user_roles user_roles_user_id_users_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_users_user_id_fk FOREIGN KEY (user_id) REFERENCES public.users(user_id);


-- Completed on 2025-04-05 04:49:45 IST

--
-- PostgreSQL database dump complete
--


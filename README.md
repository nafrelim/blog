# Blog

Projekt składa się z API Django REST Framework w [`blog_be/`](blog_be/README.md),
interfejsu React w [`blog_fe/`](blog_fe/README.md) i bazy PostgreSQL.

## Konfiguracja wspólna

W katalogu `blog_be/` skopiuj `.env.dev` do `.env` i uzupełnij `DB_PASSWORD`
oraz `SECRET_KEY`. Plik `.env` jest ignorowany przez Git; `.env.dev` jest
bezpiecznym szablonem bez sekretów. Wartości `DB_NAME`, `DB_USER` i `DB_PASSWORD`
muszą odpowiadać lokalnej bazie w wariancie 1. W wariancie 2 Compose tworzy
oddzielną bazę z tych samych wartości w swoim wolumenie.

`BE_PORT` i `FE_PORT` to porty na komputerze. Jeśli je zmienisz, ustaw też
`BLOG_API_URL` (adres API widziany przez przeglądarkę) i `FRONTEND_ORIGINS`
(dozwolony adres frontendu dla CORS/CSRF). Dla dostępu z innego hosta ustaw
również `ALLOWED_HOSTS`. Adres `db` działa tylko wewnątrz sieci Compose;
frontend w przeglądarce musi używać adresu dostępnego z komputera użytkownika.

## Wariant 1: lokalny backend i lokalny PostgreSQL

Wymagane są Python 3.14 oraz PostgreSQL 15 lub nowszy. Uruchom lokalny serwer
PostgreSQL i utwórz w nim użytkownika oraz bazę odpowiadające `DB_USER` i
`DB_NAME` w `blog_be/.env`. `DB_HOST` i `DB_PORT` wskazują ten serwer (domyślnie
`127.0.0.1:5432`).

Z katalogu `blog_be/`:

```sh
cp .env.dev .env                 # tylko za pierwszym razem; nie nadpisuj własnej konfiguracji
python3.14 -m venv .venv
.venv/bin/python -m pip install pip-tools
.venv/bin/python -m piptools sync requirements.txt
.venv/bin/python manage.py migrate
.venv/bin/python manage.py runserver 127.0.0.1:8000
```

Uzupełnij `.env` przed `migrate`. Przy innym `BE_PORT` podaj ten port również
w `runserver`. Migracje wykonujesz tylko dla lokalnej bazy. Frontend możesz
opcjonalnie uruchomić lokalnie w `blog_fe/` poleceniami `npm ci` i `npm start`;
domyślnie łączy się z `http://localhost:8000`. Inny adres API ustaw przez
`BLOG_API_URL=http://localhost:... npm start`.

## Wariant 2: cały stos w kontenerach

Wymagane są Docker i Docker Compose. Z katalogu `blog_be/`:

```sh
cp .env.dev .env                 # tylko za pierwszym razem
docker compose --env-file .env up --build -d
docker compose --env-file .env exec blog_be python manage.py migrate
```

Uzupełnij `.env` przed startem. Interfejs jest na `http://localhost:8080`, a API
na `http://localhost:8000` (lub portach ustawionych w `.env`). Baza kontenerowa
ma osobny wolumen i nie jest wystawiona na port hosta, więc może działać obok
lokalnego PostgreSQL. Dane obu baz nie synchronizują się automatycznie.
Pierwsze `migrate` przygotowuje wyłącznie bazę kontenerową.

Zatrzymanie stosu bez usuwania danych:

```sh
docker compose --env-file .env down
```

Nie uruchamiaj obu wariantów backendu jednocześnie na tym samym `BE_PORT`.
W obu wariantach konta i przykładowe wpisy są opcjonalne; polecenia
`createsuperuser` i `populateblog` uruchamiaj świadomie, bo zapisują dane.

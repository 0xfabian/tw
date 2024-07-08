drop type if exists categ_produs;
drop type if exists tip_produs;
drop type if exists tip_stoc;

create type categ_produs as enum('procesor', 'placa video', 'placa de baza', 'memorie ram', 'ssd', 'hard disk', 'sursa', 'carcasa', 'cooler', 'mouse', 'tastatura', 'casti', 'monitor');
create type tip_produs as enum('componente', 'periferice', 'altele');
create type tip_stoc as enum('suficient', 'limitat', 'epuizat');


create table if not exists produse (
   id serial primary key,
   nume varchar(50) unique not null,
   brand varchar(50) not null,
   descriere text,
   pret numeric(8,2) not null,  
   tip tip_produs,
   categorie categ_produs,
   stoc tip_stoc,
   specificatii text[],
   imagine varchar(300),
   data_adaugare timestamp default current_timestamp
);

insert into produse (nume, brand, descriere, pret, tip, categorie, stoc, specificatii, imagine) values 
('Ryzen 5 3600', 'AMD', 'Procesor AMD Ryzen 5 3600 3.6Ghz', 680, 'componente', 'procesor', 'limitat', '{"frecventa: 3.6Ghz"}', 'ryzen-5-3600.jpg');

select * from public.produse;
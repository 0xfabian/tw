drop type if exists categ_produs;
drop type if exists tip_produs;
drop type if exists tip_stoc;

create type categ_produs as enum('Procesor', 'Placă video', 'Placă de bază', 'Memorie RAM', 'SSD', 'Hard disk', 'Sursă', 'Carcasă', 'Cooler', 'Mouse', 'Tastatură', 'Căști', 'Monitor');
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
   imagini text[],
   data_adaugare timestamp default current_timestamp
);

INSERT INTO produse (nume, brand, descriere, pret, tip, categorie, stoc, specificatii, imagini) VALUES
('Ryzen 5 3600', 'AMD', 'Procesor AMD Ryzen 5 3600 3.6Ghz', 680, 'componente', 'Procesor', 'limitat', '{"Frecventa: 3.6Ghz", "Nuclee: 6", "Threads: 12", "Cache: 32MB"}', '{"ryzen-5-3600.jpg", "ryzen-5-3600-2.jpg"}'),
('Intel i5 10400F', 'Intel', 'Procesor Intel i5 10400F 2.9Ghz', 720, 'componente', 'Procesor', 'suficient', '{"Frecventa: 2.9Ghz", "Nuclee: 6", "Threads: 12", "Cache: 12MB"}', '{"i5-10400f.jpg"}'),
('GeForce RTX 3070', 'NVIDIA', 'Placa video NVIDIA GeForce RTX 3070 8GB', 3200, 'componente', 'Placă video', 'suficient', '{"Memorie: 8GB", "Tip memorie: GDDR6", "Bus memorie: 256-bit", "Frecventa memorie: 14Gbps"}', '{"rtx-3070.jpg"}'),
('Gigabyte B450M', 'Gigabyte', 'Placa de baza Gigabyte B450M', 350, 'componente', 'Placă de bază', 'limitat', '{"Socket: AM4", "Form factor: Micro-ATX", "Sloturi RAM: 4", "Porturi SATA: 6"}', '{"b450m.jpg"}'),
('Corsair Vengeance LPX 16GB', 'Corsair', 'Memorie RAM Corsair Vengeance LPX 16GB DDR4 3200MHz', 450, 'componente', 'Memorie RAM', 'suficient', '{"Capacitate: 16GB", "Frecventa: 3200MHz", "Tip: DDR4", "Latenta: CL16"}', '{"vengeance-lpx-16gb.jpg"}'),
('Samsung 970 EVO 1TB', 'Samsung', 'SSD Samsung 970 EVO 1TB NVMe', 950, 'componente', 'SSD', 'suficient', '{"Capacitate: 1TB", "Interfata: NVMe", "Viteza citire: 3500MB/s", "Viteza scriere: 3300MB/s"}', '{"970-evo-1tb.jpg"}'),
('WD Blue 1TB', 'Western Digital', 'Hard Disk WD Blue 1TB 7200RPM', 230, 'componente', 'Hard disk', 'limitat', '{"Capacitate: 1TB", "Viteza: 7200RPM", "Buffer: 64MB", "Interfata: SATA 6Gb/s"}', '{"wd-blue-1tb.jpg"}'),
('Seasonic S12III 650W', 'Seasonic', 'Sursa Seasonic S12III 650W', 300, 'altele', 'Sursă', 'suficient', '{"Putere: 650W", "Certificare: 80 Plus Bronze", "Tip cabluri: Ne-modulare", "Protectii: OPP/OVP/UVP/SCP"}', '{"s12iii-650w.jpg"}'),
('NZXT H510', 'NZXT', 'Carcasa NZXT H510 Mid Tower', 450, 'altele', 'Carcasă', 'limitat', '{"Tip: Mid Tower", "Compatibilitate placi de baza: ATX/Micro-ATX/Mini-ITX", "Porturi I/O: USB 3.1, Audio/Mic", "Suport radiatoare: 240mm/280mm"}', '{"h510.jpg"}'),
('Cooler Master Hyper 212', 'Cooler Master', 'Cooler Cooler Master Hyper 212', 180, 'altele', 'Cooler', 'suficient', '{"Compatibilitate: AM4/LGA1200", "Tip racire: Aer", "Ventilator: 120mm", "TDP: 150W"}', '{"hyper-212.jpg"}'),
('Logitech G502', 'Logitech', 'Mouse gaming Logitech G502', 300, 'periferice', 'Mouse', 'suficient', '{"DPI: 16000", "Butonuri programabile: 11", "Greutate ajustabila: Da", "Iluminare RGB: Da"}', '{"g502.jpg"}'),
('Razer BlackWidow', 'Razer', 'Tastatura gaming Razer BlackWidow', 600, 'periferice', 'Tastatură', 'limitat', '{"Tip: Mecanica", "Switch-uri: Razer Green", "Iluminare RGB: Da", "Anti-ghosting: Da"}', '{"blackwidow.jpg"}'),
('HyperX Cloud II', 'HyperX', 'Casti gaming HyperX Cloud II', 450, 'periferice', 'Căști', 'suficient', '{"Sunet: 7.1", "Microfon: Detasabil", "Compatibilitate: PC/PS4/Xbox One", "Conectivitate: USB"}', '{"cloud-ii.jpg", "cloud-ii-2.jpg", "cloud-ii-3.jpg", "cloud-ii-4.jpg"}'),
('Dell UltraSharp 27', 'Dell', 'Monitor Dell UltraSharp 27 inch', 1600, 'periferice', 'Monitor', 'suficient', '{"Rezolutie: 2560x1440", "Tip panou: IPS", "Rata de reimprospatare: 60Hz", "Conectivitate: HDMI/DP"}', '{"ultrasharp-27.jpg", "ultrasharp-27-2.jpg", "ultrasharp-27-3.jpg", "ultrasharp-27-4.jpg"}'),
('Kingston A2000 500GB', 'Kingston', 'SSD Kingston A2000 500GB NVMe', 450, 'componente', 'SSD', 'limitat', '{"Capacitate: 500GB", "Interfata: NVMe", "Viteza citire: 2200MB/s", "Viteza scriere: 2000MB/s"}', '{"a2000-500gb.jpg"}'),
('Crucial MX500 2TB', 'Crucial', 'SSD Crucial MX500 2TB', 950, 'componente', 'SSD', 'limitat', '{"Capacitate: 2TB", "Interfata: SATA 6Gb/s", "Viteza citire: 560MB/s", "Viteza scriere: 510MB/s"}', '{"mx500-2tb.jpg"}'),
('ASRock B550 Phantom Gaming', 'ASRock', 'Placa de baza ASRock B550 Phantom Gaming', 550, 'componente', 'Placă de bază', 'suficient', '{"Socket: AM4", "Form factor: ATX", "Sloturi RAM: 4", "Porturi SATA: 6"}', '{"b550-phantom.jpg"}'),
('Noctua NH-D15', 'Noctua', 'Cooler Noctua NH-D15', 400, 'altele', 'Cooler', 'limitat', '{"Compatibilitate: AM4/LGA1200", "Tip racire: Aer", "Ventilatoare: 2x140mm", "TDP: 220W"}', '{"nh-d15.jpg"}'),
('EVGA 600W', 'EVGA', 'Sursa EVGA 600W', 250, 'altele', 'Sursă', 'epuizat', '{"Putere: 600W", "Certificare: 80 Plus", "Tip cabluri: Ne-modulare", "Protectii: OPP/OVP/UVP/SCP"}', '{"evga-600w.jpg"}'),
('G.Skill Trident Z 32GB', 'G.Skill', 'Memorie RAM G.Skill Trident Z 32GB DDR4 3600MHz', 950, 'componente', 'Memorie RAM', 'suficient', '{"Capacitate: 32GB", "Frecventa: 3600MHz", "Tip: DDR4", "Latenta: CL18"}', '{"trident-z-32gb.jpg"}'),
('MSI GeForce RTX 3080', 'MSI', 'Placa video MSI GeForce RTX 3080 10GB', 5400, 'componente', 'Placă video', 'limitat', '{"Memorie: 10GB", "Tip memorie: GDDR6X", "Bus memorie: 320-bit", "Frecventa memorie: 19Gbps"}', '{"rtx-3080.jpg"}');

create user fabian with encrypted password '123456';
grant all privileges on database cti_2024 to fabian;
grant all privileges on all tables in schema public to fabian;
grant all privileges on all sequences in schema public to fabian;
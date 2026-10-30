-- Primary contact emails for partners (published general/office addresses, checked Oct 2026).
-- Only fills partners whose email is still empty, so anything you typed in admin is kept. Safe to re-run.

update partners set email = 'info@decoalonize.net' where (email is null or email = '') and lower(name) like '%decoalonize%';
update partners set email = 'info@katibainstitute.org' where (email is null or email = '') and lower(name) like '%katiba%';
update partners set email = 'gbm@greenbeltmovement.org' where (email is null or email = '') and lower(name) like '%green belt%';
update partners set email = 'coafrica@greenpeace.org' where (email is null or email = '') and lower(name) like '%greenpeace%';
update partners set email = 'media@fossilfueltreaty.org' where (email is null or email = '') and lower(name) like '%fossil fuel non-proliferation%';
update partners set email = 'info@naturaljustice.org' where (email is null or email = '') and lower(name) like '%natural justice%';
update partners set email = 'info@kenra.or.ke' where (email is null or email = '') and lower(name) like '%kenra%';
update partners set email = 'pacida@pacida.org' where (email is null or email = '') and lower(name) like '%pacida%';
update partners set email = 'namatikenya@namati.org' where (email is null or email = '') and lower(name) like '%namati%';
update partners set email = 'grootsk@grootskenya.org' where (email is null or email = '') and lower(name) like '%groots%';
update partners set email = 'info@defenderscoalition.org' where (email is null or email = '') and lower(name) like '%defenders coalition%';
update partners set email = 'info@pacja.org' where (email is null or email = '') and lower(name) like '%pacja%';
update partners set email = 'admin@khrc.or.ke' where (email is null or email = '') and lower(name) like '%khrc%';
update partners set email = 'info@mzalendohalisi.org' where (email is null or email = '') and lower(name) like '%mzalendo%';
update partners set email = 'info@greenafricafoundation.org' where (email is null or email = '') and lower(name) like '%green africa foundation%';
update partners set email = 'eastafricainfo@hivos.org' where (email is null or email = '') and lower(name) like '%vjca%';
update partners set email = 'suswatchkenya@gmail.com' where (email is null or email = '') and lower(name) like '%suswatch%';
update partners set email = 'kenyaantinuclearalliance@gmail.com' where (email is null or email = '') and lower(name) like '%anti-nuclear alliance%';
update partners set email = 'info@ilegkenya.org' where (email is null or email = '') and lower(name) like '%ileg%';
update partners set email = 'info@ronafoundation.co.ke' where (email is null or email = '') and lower(name) like '%rona foundation%';
update partners set email = 'info@justactkenya.org' where (email is null or email = '') and lower(name) like '%justact%';
update partners set email = 'info@earthlungs.org' where (email is null or email = '') and lower(name) like '%earthlungs%';
update partners set email = 'fonnap1@gmail.com' where (email is null or email = '') and lower(name) like '%fonnap%';

select name, email from partners order by (email is null or email = ''), name;

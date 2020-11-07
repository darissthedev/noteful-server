BEGIN; 

INSERT INTO notes (note_title, note_content, date_modified, folder_id)
VALUES
('First Note', 'mongul', now(), 1),
('Second Note', 'nefertidi', now(), 2),
('Third Note', 'apollo', now(), 1)
;

COMMIT;
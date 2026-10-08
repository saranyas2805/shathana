delete from audit_logs;delete from dispatches;delete from reports;delete from rescue_units;delete from incidents;
insert into incidents(id,title,category,description,latitude,longitude,location_text,severity,severity_score,severity_reasons,report_count,status) values
('00000000-0000-0000-0000-000000000001','Fire near Tambaram Railway Station','FIRE','Building fire with people trapped.',12.9249,80.1000,'Tambaram Railway Station','CRITICAL',13,'["fire spreading","people trapped","immediate danger"]',3,'TRIAGED'),
('00000000-0000-0000-0000-000000000002','Flooding at Velachery Main Road','FLOOD','Rising water stranded residents.',12.9750,80.2210,'Velachery Main Road','HIGH',7,'["rising water","stranded"]',2,'TRIAGED'),
('00000000-0000-0000-0000-000000000003','Medical emergency at Adyar','MEDICAL','Severe injury reported.',13.0067,80.2570,'Adyar','HIGH',8,'["severe injury","immediate danger"]',1,'DISPATCHED'),
('00000000-0000-0000-0000-000000000004','Blocked road at Guindy','ROAD BLOCKAGE','Flood debris blocks one lane.',13.0067,80.2206,'Guindy','MEDIUM',2,'["blocked road","flooding"]',1,'NEW'),
('00000000-0000-0000-0000-000000000005','Minor property damage at Porur','OTHER','Minor storm damage observed.',13.0358,80.1560,'Porur','LOW',1,'["property damage"]',1,'NEW');
insert into reports(id,incident_id,description,source,latitude,longitude,location_text,severity,severity_score,severity_reasons) values
('10000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001','Fire spreading near Tambaram station, people trapped.','text',12.9249,80.1000,'Tambaram Railway Station','CRITICAL',13,'["fire spreading","people trapped"]'),
('10000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000001','Smoke and flames visible near the station building.','voice',12.9252,80.1002,'Tambaram Railway Station','HIGH',8,'["fire spreading"]'),
('10000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000001','People are trapped inside.','text',12.9247,80.0998,'Tambaram Railway Station','CRITICAL',10,'["people trapped"]'),
('10000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000002','Water is rising and residents are stranded.','text',12.9750,80.2210,'Velachery Main Road','HIGH',7,'["rising water","stranded"]'),
('10000000-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000002','Flooding across the road.','text',12.9753,80.2212,'Velachery Main Road','MEDIUM',2,'["flooding"]'),
('10000000-0000-0000-0000-000000000006','00000000-0000-0000-0000-000000000003','Person has severe injury.','text',13.0067,80.2570,'Adyar','HIGH',8,'["severe injury"]'),
('10000000-0000-0000-0000-000000000007','00000000-0000-0000-0000-000000000004','Road blocked by debris.','text',13.0067,80.2206,'Guindy','MEDIUM',2,'["blocked road"]'),
('10000000-0000-0000-0000-000000000008','00000000-0000-0000-0000-000000000005','Minor property damage observed.','image',13.0358,80.1560,'Porur','LOW',1,'["property damage"]');
insert into rescue_units(id,name,type,latitude,longitude,status,current_incident_id) values
('20000000-0000-0000-0000-000000000001','Fire Rescue Unit 01','Fire Rescue',12.9300,80.1050,'AVAILABLE',null),
('20000000-0000-0000-0000-000000000002','Fire Rescue Unit 02','Fire Rescue',12.9200,80.0970,'AVAILABLE',null),
('20000000-0000-0000-0000-000000000003','Flood Rescue Unit 01','Flood Rescue',12.9700,80.2250,'ASSIGNED','00000000-0000-0000-0000-000000000002'),
('20000000-0000-0000-0000-000000000004','Ambulance Unit 01','Ambulance',13.0100,80.2600,'EN_ROUTE','00000000-0000-0000-0000-000000000003'),
('20000000-0000-0000-0000-000000000005','General Rescue 01','General Rescue',13.0000,80.2150,'ON_SCENE','00000000-0000-0000-0000-000000000004'),
('20000000-0000-0000-0000-000000000006','General Rescue 02','General Rescue',13.0400,80.1500,'AVAILABLE',null);
insert into dispatches(incident_id,unit_id,status) values('00000000-0000-0000-0000-000000000002','20000000-0000-0000-0000-000000000003','ASSIGNED'),('00000000-0000-0000-0000-000000000003','20000000-0000-0000-0000-000000000004','EN_ROUTE');

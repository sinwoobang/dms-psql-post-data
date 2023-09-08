DO
$$
    DECLARE
        row RECORD;
    BEGIN
        FOR row IN (
            SELECT d.refobjid::regclass as schema, a.attname as field, seq.sequence_name
            FROM pg_depend d
                 INNER JOIN pg_attribute a ON a.attrelid = d.refobjid AND a.attnum = d.refobjsubid
                 INNER JOIN information_schema.sequences as seq ON d.objid = ('"' || seq.sequence_schema || '"."' || seq.sequence_name || '"')::regclass
            WHERE d.refobjsubid > 0
              AND d.classid = 'pg_class'::regclass
        )
            LOOP
                RAISE NOTICE 'RAISE NOTICE ''[START] %'';', row;
                RAISE NOTICE 'CREATE SEQUENCE IF NOT EXISTS % OWNED BY %.%;', row.sequence_name, row.schema, row.field;
                RAISE NOTICE 'PERFORM setval(''"%"'', (SELECT COALESCE(max(%), 0) + 1 FROM %));', row.sequence_name, row.field, row.schema;
                RAISE NOTICE 'ALTER TABLE % ALTER COLUMN % SET DEFAULT nextVal(''"%"'');', row.schema, row.field, row.sequence_name;
            END LOOP;
        RAISE NOTICE 'RAISE NOTICE ''[DONE]'';';
    END
$$;

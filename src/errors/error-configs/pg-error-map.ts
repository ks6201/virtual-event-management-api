import { makeReadOnly } from "../../libs/utils";

export const PG_ERROR_CODE_MAP: Readonly<Record<string, string>> = makeReadOnly({
    '23505': 'Duplicate',
    '23503': 'Foreign key violation',
    '23502': 'Not null',
    '22003': 'Numeric overflow',
    '22001': 'Truncate error',
    '42601': 'Syntax error',        
    '23514': 'Check constraint',    
    '22007': 'Invalid date format', 
    '08006': 'Connection failure',  
    '08003': 'No connection',       
    '42703': 'Undefined column',    
    '55000': 'Object state error',  
    '08004': 'Connection rejected', 
    '28000': 'Authentication error',
});
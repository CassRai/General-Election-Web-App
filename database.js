import mysql from 'mysql2'

import dotenv from "dotenv"
dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
}).promise()

export async function getCandidates(constituency_num){
    const [rows] = await pool.query(`
    SELECT * 
    FROM candidate
    WHERE
    constituency_id = ?
    `, [constituency_num])
    return rows
}

export async function getAllCandidates(){
    const [rows] = await pool.query(`
    SELECT * 
    FROM candidate
    WHERE
    `,)
    return rows
}

export async function getCandidate(id){
    const [rows] = await pool.query(`
    SELECT *
    FROM candidate
    WHERE canid = ?
    `, [id])
    return rows[0]
}
export async function createCandidate(id,name,party,constituency,vote_num){
    const [result] = await pool.query(`
    INSERT INTO candidate(canid, candidate, party_id,constituency_id,vote_count)
    VALUES (?,?,?,?,?)
    `, [id,name,party,constituency,vote_num])
    return result
}

export async function getVoter(id){
    const [rows] = await pool.query(`
    SELECT *
    FROM voter
    WHERE voter_id = ?
    `, [id])
    return rows[0]
}

export async function createVoter(id,name,DOB,password,UVC,constituency){
    const [result] = await pool.query(`
    INSERT INTO voter(voter_id, full_name, DOB,password,UVC,constituency_id)
    VALUES (?,?,?,?,?,?)
    `, [id,name,DOB,password,UVC,constituency])
    return result
}

export async function getUVC(uvc){
    const [rows] = await pool.query(`
    SELECT *
    FROM uvc_code
    WHERE UVC = ?
    `, [uvc])
    return rows[0]
}

export async function updateUVC(uvc){
    const [result] = await pool.query(`
    UPDATE uvc_code
    SET used = ?
    WHERE UVC = ?
    `, [1,uvc])
    return result
}

export async function getParty(party_num){
    const [rows] = await pool.query(`
    SELECT *
    FROM party
    WHERE party_id = ?
    `, [party_num])
    return rows[0]
}

export async function getConstituency(name){
    const [rows] = await pool.query(`
    SELECT *
    FROM constituency
    WHERE constituency_name = ?
    `, [name])
    return rows[0]
}

export async function increment_c_vote(canId){
    const candidate = await getCandidate(canId);
    if (!candidate) {
        return null;
    }
    const newVoteCount = candidate.vote_count + 1;

    const [result] = await pool.query(`
    UPDATE candidate
    SET vote_count = ?
    WHERE canid = ?
`, [newVoteCount, canId]);

    return result
}


//const candidates = await getCandidates(2)

//const candidate = await getVoter("cassandraedwards300@gmail.com")

//const voter = await createVoter("cassandraedwards300@hotmail.com", "Cassandra Edwards", "2001/03/01",'b6573a02de91d76cc442a6f42aa749c6eee0982c148bb7e9116ee44f93e6807a',4)


//const update_uvc = await updateUVC("2E5BHT5R")

//const uvc_num = await getUVC("2E5BHT5R")

//const result = await createCandidate(10, "Irina Husti-Radulet",3,2,0)

//const party_name = await getParty(2)

//const constituency_nane = await getConstituency(2)

//console.log(candidates)
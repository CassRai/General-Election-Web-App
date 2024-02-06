import express from "express"

import {getCandidates, getCandidate,createCandidate,getVoter, createVoter, getUVC,updateUVC,getParty,getConstituency, increment_c_vote, getAllCandidates} from "./database.js";
import {hash_pass} from "./auth.js";

const app = express();
app.set("view engine", "ejs")
app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) =>{
    res.render("GEVS.ejs")
})

app.get('/voter-login', (req, res) => {
    res.render("voter_sign-in.ejs");
});

app.get('/voter-registration', (req, res) => {
    res.render("voter_registration.ejs");
});

app.get('/eco-login', (req, res) => {
    res.render("eco_sign-in.ejs");
});

app.post('/voter-login_process', async (req, res) => {
    const voterId = req.body.email_add;
    const password = req.body.password;

    const voter = await getVoter(voterId);
    const hex_val = await hash_pass(password);
    
    if (voter && voter.password === hex_val) {
        const candidates = await getCandidates(voter.constituency_id);
        res.render("voter_dashboard.ejs", { voter, candidates, voterId });
    } else {
        res.render("error.ejs", { errorMessage: "Invalid voter ID or password" });
    }
});

app.post('/eco-login_process', async (req, res) =>{
    const username = req.body.email_add;
    const password = req.body.password;

    const candidates = getAllCandidates();

    if (username == "election@shangrila.gov.sr" && password == "shangrila2024$"){
        res.render("eco_dashboard.ejs", { candidates });
    } else{
        res.render("error.ejs", { errorMessage: "Incorrect username or password" });
    }

})

app.post('/register_voter', async (req,res) =>{
    const voterId = req.body.email_add;
    const name = req.body.f_name + ' ' + req.body.l_name;
    const DOB = req.body.dob;
    const constituency_name = req.body.constituency;
    const UVC = req.body.uvc;
    const password = req.body.password;
    const password_match = req.body.repeat;

    const hex_val = await hash_pass(password);

    const uvcInfo = await getUVC(UVC);
    if (password == password_match) {
        if (uvcInfo && uvcInfo.used == 0) {
            await updateUVC(UVC);
            const constituency = await getConstituency(constituency_name);
            await createVoter(voterId, name, DOB, hex_val, UVC, constituency.constituency_id);
            const voter = await getVoter(voterId);

    
            const candidates = await getCandidates(voter.constituency_id);
            res.render("voter_dashboard.ejs", {voterId,candidates});
        } else {
            res.render("error.ejs", { errorMessage: "Invalid or used UVC" });
        }
    } else {
        res.render("error.ejs", { errorMessage: "Passwords do not match" });
    }
   
})

app.post('/submit-vote', async (req, res) => {
    const voterId = req.body.voterId;
    const candidateId = req.body.candidateId;

    await increment_c_vote(candidateId);
});


app.use(express.static("html pages"))

const port = "8080"

app.listen(port, () => {
    console.log(`GEVS app listening at http://localhost:${port}`);
});


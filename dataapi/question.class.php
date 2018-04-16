<?php

require_once("dbconnection.class.php");
require_once("user.class.php");

class Question
{
    static public function create($question, $imageurl, $answera, $answerb, $asnwerc, $answerd, $correctAnswer, $points)
    {
        $conn = new DBConnection();

        $sql = "
            INSERT INTO question(question, imageurl, answera, answerb, answerc, answerd, answer, points)
            VALUES ('$question', '$imageurl', '$answera', '$answerb', '$asnwerc', '$answerd', '$correctAnswer', '$points')
        ";

        $conn->db->query($sql);
        if ($conn->db->insert_id)
            return 0;
        return 1;
    }

    static public function remove($id){
        $conn = new DBConnection();

        if (!Question::exists($id))
            return 2;

        $sql = "
            DELETE FROM question 
            WHERE question = '$id'
        ";

        $conn->db->query($sql);
        return 0;
    }

    /**
     * @param question Question
     * @param user User
     */
    static public function collect($id, $user, $answer){
        $conn = new DBConnection();

        if (Question::isCollected($id, $user))
            return 2;

        $userID = $user->getID();
        $correct = (integer)($answer == Question::getCorrectAnswer($id));

        $sql = "
            INSERT INTO user_question(id_user, id_question, time, answer, correct)
            VALUES ($userID, $id, NOW(), $answer, $correct)
        ";

        $conn->db->query($sql);
        echo $conn->db->error;
        if ($conn->db->insert_id)
            return 0;
        return 1;
    }

    /**
     * @param question Question
     * @param user User
     */
    static public function drop($id, $user){
        $conn = new DBConnection();

        if (!Question::isCollected($id, $user))
            return 2;

        $userID = $user->getID();

        $sql = "
            DELETE FROM user_question 
            WHERE id_question = $id AND id_user = $userID;   
        ";

        $conn->db->query($sql);
        return 0;
    }

    /**
     * @param question Question
     * @param user User
     */
    static public function isCollected($id, $user){
        $conn = new DBConnection();

        $userID = $user->getID();

        $sql = "
            SELECT *
            FROM user_question
            WHERE id_question = $id AND id_user = $userID;           
        ";

        $result = $conn->db->query($sql);

        return ($result && $result->num_rows) ? true : false;
    }

    static public function exists($id)
    {
        $conn = new DBConnection();

        $sql = "
            SELECT id
            FROM question
            WHERE id = '$id'
        ";

        $result = $conn->db->query($sql);

        return ($result && $result->num_rows) ? true : false;
    }

    /**
     * @param question Question
     * @param user User
     */
    static public function getCorrectAnswer($id){
        $conn = new DBConnection();

        $sql = "
            SELECT answer
            FROM question
            WHERE id = $id
        ";

        $result = $conn->db->query($sql);

        if (!$result)
            return 1;

        $result = $result->fetch_assoc();
        return $result['answer'];
    }


    static public function getData($id)
    {
        $conn = new DBConnection();
        if(!Question::exists($id))
            return 1;

        $sql = "
            SELECT *
            FROM question
            WHERE id = $id
        ";

        $result = $conn->db->query($sql);

        if (!$result)
            return 1;

        $result = $result->fetch_assoc();

        return [
            "ID" => intval($result['id']),
            "question" => $result['question'],
            "imageUrl" => $result['imageurl'],
            "answers" => [$result['answera'], $result['answerb'], $result['answerc'], $result['answerd']],
            "correctAnswer" => intval($result['answer']),
            "points" => intval($result['points'])
        ];
    }

    static public function getRandomQuestionID($user)
    {
        $conn = new DBConnection();

        $sql = "
            SELECT id
            FROM question
            ORDER BY RAND()
            LIMIT 1
        ";

        $result = $conn->db->query($sql);

        if (!$result)
            return 1;

        $result = $result->fetch_assoc();

        return (Question::isCollected($result['id'], $user)) ? Question::getRandomQuestionID($user) : $result["id"];
    }

    static public function getAllCollected(){
        $conn = new DBConnection();

        $sql = "
            SELECT users.login, users.name, users.class, question.question, question.points, user_question.correct, user_question.time
            FROM user_question
            INNER JOIN question on user_question.id_question = question.id
            INNER JOIN users on user_question.id_user = users.id
            ORDER BY user_question.time
        ";

        $result = $conn->db->query($sql);

        $data = [];
        while ($row = $result->fetch_assoc())
            array_push($data, [
                "login" => $row["login"],
                "name" => $row["name"],
                "class" => $row["class"],
                "question" => $row["question"],
                "value" => (intval($row["correct"])) ? intval($row["points"]) : 0,
                "time" => $row["time"]
            ]);

        return $data;
    }
}
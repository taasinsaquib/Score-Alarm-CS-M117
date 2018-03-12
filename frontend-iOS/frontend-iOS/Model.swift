//
//  Model.swift
//  frontend-iOS
//
//  Created by Ashwin Vivek on 3/11/18.
//  Copyright © 2018 cs-m117. All rights reserved.
//

import Foundation

struct Games: Decodable {
    let teams: [String]
    let goals: [Int]
    let _id: String
    let game_id: String
    let _v: Int
    let active: String
    let game_time: Int
    let start_details: String
    
    enum CodingKeys: String, CodingKey {
        case teams
        case goals
        case _id
        case game_id
        case _v
        case active
        case game_time
        case start_details
    }
}


class Game: NSObject, NSCoding  {
    let team1: String
    let team2: String
    let date: String
    
    init(team1: String, team2: String, date: String) {
        self.team1 = team1
        self.team2 = team2
        self.date = date
    }
    
    required convenience init(coder aDecoder: NSCoder) {
        let team1 = aDecoder.decodeObject(forKey: "team1") as! String
        let team2 = aDecoder.decodeObject(forKey: "team2") as! String
        let date = aDecoder.decodeObject(forKey: "date") as! String
        self.init(team1: team1, team2: team2, date: date)
    }
    
    func encode(with aCoder: NSCoder) {
        aCoder.encode(team1, forKey: "team1")
        aCoder.encode(team2, forKey: "team2")
        aCoder.encode(date, forKey: "date")
    }
};

class Alarm: NSObject, NSCoding  {
    let team1: String
    let team2: String
    let numConditions: Int
    
    init(team1: String, team2: String, numConditions: Int) {
        self.team1 = team1
        self.team2 = team2
        self.numConditions = numConditions
    }
    
    required convenience init(coder aDecoder: NSCoder) {
        let team1 = aDecoder.decodeObject(forKey: "team1") as! String
        let team2 = aDecoder.decodeObject(forKey: "team2") as! String
        let numConditions = aDecoder.decodeInteger(forKey: "numConditions")
        self.init(team1: team1, team2: team2, numConditions: numConditions)
    }
    
    func encode(with aCoder: NSCoder) {
        aCoder.encode(team1, forKey: "team1")
        aCoder.encode(team2, forKey: "team2")
        aCoder.encode(numConditions, forKey: "numConditions")
    }
};

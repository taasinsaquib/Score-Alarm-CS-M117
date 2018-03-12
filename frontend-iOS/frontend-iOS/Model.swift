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


struct Game {
    let teams: [String]
    let date: String
};

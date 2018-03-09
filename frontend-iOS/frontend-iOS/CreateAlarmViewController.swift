//
//  CreateAlarmViewController.swift
//  frontend-iOS
//
//  Created by Ashwin Vivek on 3/8/18.
//  Copyright © 2018 cs-m117. All rights reserved.
//

import UIKit

class CreateAlarmViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {
    
    
    
    @IBOutlet weak var conditionsTable: UITableView!
    
    var team1: String = "Juventus"
    var team2: String = "Real Madrid"
    
    override func viewDidLoad() {
        super.viewDidLoad()

        conditionsTable.delegate = self
        conditionsTable.dataSource = self
        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return 1
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        if(indexPath.section == 0) {
            let cell = tableView.dequeueReusableCell(withIdentifier: "goalDifference") as! GoalConditionTVCell
            return cell
        }
        else if(indexPath.section == 1) {
            let cell = tableView.dequeueReusableCell(withIdentifier: "goalsScoredTeam1") as! GoalConditionTVCell
            return cell
        }
        else if(indexPath.section == 2) {
            let cell = tableView.dequeueReusableCell(withIdentifier: "goalsScoredTeam2") as! GoalConditionTVCell
            return cell
        }
        else if(indexPath.section == 3) {
            let cell = tableView.dequeueReusableCell(withIdentifier: "whichTeamLeading") as! GoalConditionTVCell
            cell.isTeamCondition = true
            
            //TODO: get team name from previous VC
            cell.teamNames[0] = team1
            cell.teamNames[1] = team2
            return cell
        }
        let cell = tableView.dequeueReusableCell(withIdentifier: "reuseIdentifier", for: indexPath)
        
        return cell
    }
    
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        
        
            return CGFloat(100)
        
        
    }
    
    func numberOfSections(in tableView: UITableView) -> Int {
        // #warning Incomplete implementation, return the number of sections
        return 4
    }
    
    func tableView(_ tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        var ret = ""
        if(section == 0) {
            ret = "Goal Difference"
        }
        if(section == 1) {
            ret = "Goals scored by \(team1)"
        }
        if(section == 2) {
            ret = "Goals scored by \(team2)"
        }
        if(section == 3) {
            ret = "Which team is leading?"
        }
        
        return ret
    }

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}

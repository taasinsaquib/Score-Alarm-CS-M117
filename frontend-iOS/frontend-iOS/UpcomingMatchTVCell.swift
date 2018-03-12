//
//  MatchTVCell.swift
//  frontend-iOS
//
//  Created by Ashwin Vivek on 3/8/18.
//  Copyright © 2018 cs-m117. All rights reserved.
//

import UIKit

class UpcomingMatchTVCell: UITableViewCell {

    @IBOutlet weak var timeLabel: UILabel!
    @IBOutlet weak var team1Label: UILabel!
    @IBOutlet weak var team2Label: UILabel!
    @IBOutlet weak var actionButton: UIButton!
    
    var cellIndex: Int = 0
    
    var parentViewController: FirstViewController!
    
    @IBAction func actionButtonPressed(_ sender: Any) {
        if let parentVC = self.parentViewController as? FirstViewController {
            parentVC.chosenTeam1 = team1Label.text!
            parentVC.chosenTeam2 = team2Label.text!
            parentVC.chosenCell = cellIndex
            parentVC.performSegue(withIdentifier: "toCreateAlarmVC", sender: self)
        }
    }
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }

}

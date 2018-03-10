
//
//  Extensions.swift
//  frontend-iOS
//
//  Created by Ashwin Vivek on 3/9/18.
//  Copyright © 2018 cs-m117. All rights reserved.
//

import Foundation
import UIKit

extension UIView {
    func addBorderTop(size size: CGFloat, color: UIColor) {
        addBorderUtility(x: 0, y: 0, width: frame.width, height: size, color: color)
    }
    func addBorderBottom(size size: CGFloat, color: UIColor) {
        addBorderUtility(x: 0, y: frame.height - size, width: frame.width, height: size, color: color)
    }
    func addBorderLeft(size size: CGFloat, color: UIColor) {
        addBorderUtility(x: 0, y: 0, width: size, height: frame.height, color: color)
    }
    func addBorderRight(size size: CGFloat, color: UIColor) {
        addBorderUtility(x: frame.width - size, y: 0, width: size, height: frame.height, color: color)
    }
    private func addBorderUtility(x x: CGFloat, y: CGFloat, width: CGFloat, height: CGFloat, color: UIColor) {
        let border = CALayer()
        border.backgroundColor = color.cgColor
        border.frame = CGRect(x: x, y: y, width: width, height: height)
        layer.addSublayer(border)
    }
}

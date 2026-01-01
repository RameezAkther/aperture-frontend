import React from "react";
import "./DeleteConfirmDialog.css";

type Props = {
	isOpen: boolean;
	projectName: string;
	onConfirm: () => void;
	onCancel: () => void;
};

const DeleteConfirmDialog: React.FC<Props> = ({
	isOpen,
	projectName,
	onConfirm,
	onCancel,
}) => {
	if (!isOpen) return null;

	return (
		<div className="modal-overlay">
			<div className="modal-content">
				<h3>Delete Project?</h3>
				<p>
					Are you sure you want to delete{" "}
					<strong>"{projectName}"</strong>?<br />
					This action cannot be undone.
				</p>
				<div className="modal-actions">
					<button className="btn-cancel" onClick={onCancel}>
						Cancel
					</button>
					<button className="btn-delete" onClick={onConfirm}>
						Delete
					</button>
				</div>
			</div>
		</div>
	);
};

export default DeleteConfirmDialog;

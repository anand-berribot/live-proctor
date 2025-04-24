// Multiple Skills Selection Dialog
export const MultiSkillsDialog = ({ open, onClose, skillsData, setSelectedSkillsValues }) => {
    const [selectedValues, setSelectedValues] = useState({ all_skills: {} });
    const [isSelectOpen, setIsSelectOpen] = useState(false);

    const handleConfirm = () => {
        setSelectedSkillsValues(selectedValues);
        onClose(true);
    };

    const handleChange = (event) => {
        const selectedKeys = event.target.value;

        // Ensure 1 or 2 items are selected
        if (selectedKeys.length <= 2) {
            const newSelected = {
                all_skills: selectedKeys.reduce((acc, key) => {
                    acc[key] = skillsData.skills.all_skills[key];
                    return acc;
                }, {}),
            };
            setSelectedValues(newSelected);
            setIsSelectOpen(false); // Close dropdown after selection
        }
    };

    // Updated to allow 1 or 2 selections
    const isSelectionValid = Object.keys(selectedValues.all_skills).length >= 1;

    return (
        <Dialog
            open={open}
            onClose={() => onClose(false)}
            maxWidth="sm"
            fullWidth
            sx={{ textAlign: 'center', p: 3 }}
        >
            <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center', pb: 2 }}>
                Select Your Preferred Skills
            </DialogTitle>

            <DialogContent sx={{ textAlign: 'center', pb: 3 }}>
                <Typography variant="body2" sx={{ mb: 3 }}>
                    Choose one or two skills that best describe your expertise.
                </Typography>

                <FormControl fullWidth>
                    <InputLabel id="multi-select-skills-label">Skills</InputLabel>
                    <Select
                        labelId="skills-label"
                        multiple
                        open={isSelectOpen}
                        onOpen={() => setIsSelectOpen(true)}
                        onClose={() => setIsSelectOpen(false)}
                        value={Object.keys(selectedValues.all_skills)}
                        onChange={handleChange}
                        label="Preferred Skills"
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                    <Chip key={value} label={value} />
                                ))}
                            </Box>
                        )}
                    >
                        {Object.keys(skillsData?.skills?.all_skills || {}).map((key) => (
                            <MenuItem key={key} value={key} disabled={Object.keys(selectedValues.all_skills).length >= 2 && !selectedValues.all_skills[key]}>
                                <Checkbox checked={Object.keys(selectedValues.all_skills).includes(key)} />
                                <ListItemText primary={key} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Typography variant="caption" sx={{ mt: 2, display: 'block', color: 'text.secondary' }}>
                    * You must select one or two skills.
                </Typography>
            </DialogContent>

            {isSelectionValid && (
                <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button
                        variant="contained"
                        onClick={handleConfirm}
                        color="primary"
                        sx={{ px: 3, fontWeight: 'bold', borderRadius: 2 }}
                    >
                        Confirm
                    </Button>
                </DialogActions>
            )}
        </Dialog>
    );
};

// Single Skill Selection Dialog
export const SingleSkillDialog = ({ open, onClose, skillsData, setSelectedSkillsValues }) => {
    const [selectedValues, setSelectedValues] = useState({});

    const handleConfirm = () => {
        setSelectedSkillsValues(selectedValues);
        onClose(true); // Pass true to indicate confirmation
    };

    const handleChange = (skill, value) => {
        setSelectedValues((prevState) => ({
            ...prevState,
            [skill]: [value],
        }));
    };

    const allSelected = Object.keys(skillsData?.skills || {}).every(
        (key) => selectedValues[key]
    );

    return (
        <Dialog
            open={open}
            onClose={() => onClose(false)} // Ensure onClose is correctly triggered
            maxWidth="sm"
            fullWidth
            sx={{ textAlign: 'center', p: 3 }}
        >
            <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center', pb: 2 }}>
                Select Your Preferred Skill
            </DialogTitle>

            <DialogContent sx={{ textAlign: 'center', pb: 3 }}>
                <Typography variant="body2" sx={{ mb: 3 }}>
                    Choose your preferred skill to tailor the interview.
                </Typography>

                <Stack spacing={3}>
                    {Object.keys(skillsData?.skills || {}).map((key) => (
                        <FormControl fullWidth key={key}>
                            <InputLabel id={`skill-value-label-${key}`}>{key}</InputLabel>
                            <Select
                                labelId={`skill-value-label-${key}`}
                                value={selectedValues[key] || ''}
                                onChange={(e) => handleChange(key, e.target.value)}
                                label={key}
                            >
                                {skillsData.skills[key].map((value) => (
                                    <MenuItem key={value} value={value}>
                                        {value}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    ))}
                </Stack>
            </DialogContent>

            {allSelected && (
                <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button
                        variant="contained"
                        onClick={handleConfirm} // Ensure confirm triggers onClose
                        color="primary"
                        sx={{ px: 3, fontWeight: 'bold' }}
                    >
                        Confirm
                    </Button>
                </DialogActions>
            )}
        </Dialog>
    );
};
